import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { __, _n, sprintf } from "@wordpress/i18n";
import {
  Button,
  ButtonSizes,
  ButtonTypes,
  classNames,
  FontWeights,
  IconNames,
  IconSize,
  InfoBox,
  Link,
  Render,
  Text,
  TextIcon,
  TextTypes,
} from "vanguard";
import { StepLayout } from "../StepLayout";
import { fixActionLabel, fixKindForIssue, FixKind, priorityLabel } from "../issue-mapping";
import {
  ContentItem,
  getOptimiserResult,
  listScannableContent,
  PageIssue,
  PageScanResult,
  rerunOptimiser,
  runSiteScan,
  toPageScanResult,
  WizardRequestError,
} from "../setup-wizard-api";
import { IssueFixPanel } from "./IssueFixPanel";
import shared from "../SetupWizard.module.scss";
import styles from "./ScanStep.module.scss";

export type ScanOutcome = "results" | "empty" | "partial" | "error";

export interface ScanSnapshot {
  outcome: ScanOutcome;
  scanned: number;
  pages: PageScanResult[];
  fixedKeys: string[];
  loopbackSuspected: boolean;
  errorMessage?: string;
}

interface ScanStepProps {
  snapshot: ScanSnapshot | null;
  onSnapshot: (snapshot: ScanSnapshot) => void;
  onBack: () => void;
  onNext: () => void;
}

type Phase = "idle" | "scanning" | "collecting" | "done";

const RESULT_BATCH_SIZE = 4;

const getChecks = (): string[] => [
  __("Focus keyword assignment", "beyondseo"),
  __("Titles and meta descriptions", "beyondseo"),
  __("Heading structure", "beyondseo"),
  __("Image descriptions", "beyondseo"),
  __("Canonical and indexing settings", "beyondseo"),
];

const issueKey = (postId: number, issueType: string): string => `${postId}:${issueType}`;

const buildSnapshot = (scanned: number, pages: PageScanResult[], fixedKeys: string[] = []): ScanSnapshot => {
  const analyzed = pages.filter((page) => page.analyzed && !page.failed);
  const incomplete = pages.length - analyzed.length;
  const loopbackSuspected = analyzed.length > 0 && analyzed.every((page) => page.score === 0);
  const issueCount = analyzed.reduce((sum, page) => sum + page.issues.length, 0);

  let outcome: ScanOutcome = "results";
  if (pages.length > 0 && analyzed.length === 0) {
    outcome = "error";
  } else if (incomplete > 0 || loopbackSuspected) {
    outcome = "partial";
  } else if (issueCount === 0) {
    outcome = "empty";
  }

  return { outcome, scanned, pages, fixedKeys, loopbackSuspected };
};

const describeError = (error: unknown): string => {
  if (error instanceof WizardRequestError) {
    if (error.code === "rankingcoach_circuit_breaker_open") {
      return error.message;
    }
    if (error.status >= 500) {
      return __(
        "The site check could not finish on the server. Large sites can take longer than the server allows.",
        "beyondseo",
      );
    }
  }

  return __("We could not complete the site check.", "beyondseo");
};

const pathOf = (link: string): string => {
  try {
    return new URL(link).pathname;
  } catch {
    return link;
  }
};

const scoreClass = (score: number | null): string => {
  if (score === null) {
    return "";
  }

  return score >= 76 ? styles.scoreGood : score < 40 ? styles.scoreLow : "";
};

export const ScanStep: React.FC<ScanStepProps> = ({ snapshot, onSnapshot, onBack, onNext }) => {
  const [phase, setPhase] = useState<Phase>(snapshot ? "done" : "idle");
  const [notice, setNotice] = useState<string | null>(null);
  const [openFix, setOpenFix] = useState<{
    post: ContentItem;
    issue: PageIssue;
    kind: Exclude<FixKind, "editor">;
  } | null>(null);
  const [recheckingId, setRecheckingId] = useState<number | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => () => abortRef.current?.abort(), []);

  const start = async () => {
    const controller = new AbortController();
    abortRef.current = controller;
    setNotice(null);
    setOpenFix(null);
    setPhase("scanning");

    try {
      const scanned = await runSiteScan(controller.signal);
      setPhase("collecting");

      const content = await listScannableContent(controller.signal);
      const pages: PageScanResult[] = [];
      for (let index = 0; index < content.length; index += RESULT_BATCH_SIZE) {
        const batch = content.slice(index, index + RESULT_BATCH_SIZE);
        const results = await Promise.all(
          batch.map(async (post): Promise<PageScanResult> => {
            try {
              return toPageScanResult(post, await getOptimiserResult(post.id, controller.signal));
            } catch (error) {
              if (controller.signal.aborted) {
                throw error;
              }

              return { post, analyzed: false, failed: true, score: null, issues: [] };
            }
          }),
        );
        pages.push(...results);
      }

      onSnapshot(buildSnapshot(scanned, pages));
      setPhase("done");
    } catch (error) {
      if (controller.signal.aborted) {
        setPhase("idle");
        setNotice(
          __(
            "Scan cancelled. A check that already started on the server will still finish in the background.",
            "beyondseo",
          ),
        );
        return;
      }
      onSnapshot({
        outcome: "error",
        scanned: 0,
        pages: [],
        fixedKeys: [],
        loopbackSuspected: false,
        errorMessage: describeError(error),
      });
      setPhase("done");
    }
  };

  const cancel = () => abortRef.current?.abort();

  const markFixed = (postId: number, issueType: string) => {
    if (snapshot) {
      onSnapshot({ ...snapshot, fixedKeys: Array.from(new Set([...snapshot.fixedKeys, issueKey(postId, issueType)])) });
    }
    setOpenFix(null);
  };

  const recheck = async (page: PageScanResult) => {
    if (!snapshot) {
      return;
    }
    setRecheckingId(page.post.id);
    setNotice(null);
    try {
      const updated = toPageScanResult(page.post, await rerunOptimiser(page.post.id));
      const pages = snapshot.pages.map((entry) => (entry.post.id === page.post.id ? updated : entry));
      const fixedKeys = snapshot.fixedKeys.filter((key) => !key.startsWith(`${page.post.id}:`));
      onSnapshot(buildSnapshot(snapshot.scanned, pages, fixedKeys));
    } catch {
      setNotice(__("The page could not be rechecked. Please try again in a moment.", "beyondseo"));
    } finally {
      setRecheckingId(null);
    }
  };

  const renderIssue = (page: PageScanResult, issue: PageIssue) => {
    const kind = fixKindForIssue(issue.issueType);
    const fixed = snapshot?.fixedKeys.includes(issueKey(page.post.id, issue.issueType));
    const isOpen = openFix?.post.id === page.post.id && openFix.issue.issueType === issue.issueType;

    return (
      <li key={issue.issueType} className={styles.issue}>
        <div className={styles.issueMain}>
          <span
            className={styles.priority}
            style={issue.hex ? { color: issue.hex, background: `${issue.hex}1a` } : undefined}
          >
            {issue.label || priorityLabel(issue.priority)}
          </span>
          <div className={styles.issueText}>
            <Text type={TextTypes.text} fontWeight={FontWeights.medium}>
              {issue.title}
            </Text>
            <Render if={!!issue.description}>
              <Text type={TextTypes.textHelp} className={shared.fine}>
                {issue.description}
              </Text>
            </Render>
          </div>
        </div>
        <div className={styles.issueAction}>
          {fixed ? (
            <TextIcon
              icon={IconNames.check}
              iconColor="var(--s500)"
              iconSize={IconSize.small}
              textType={TextTypes.textHelp}
              verticalAlign="center"
            >
              {__("Updated, recheck to confirm", "beyondseo")}
            </TextIcon>
          ) : kind === "editor" ? (
            <Link href={page.post.editLink} target="_blank">
              {fixActionLabel(kind)}
            </Link>
          ) : (
            <Button
              type={ButtonTypes.secondary}
              size={ButtonSizes.small}
              onClick={() => setOpenFix(isOpen ? null : { post: page.post, issue, kind })}
            >
              {fixActionLabel(kind)}
            </Button>
          )}
        </div>
        <Render if={isOpen}>
          <IssueFixPanel
            post={page.post}
            kind={openFix?.kind || "title"}
            onSaved={() => markFixed(page.post.id, issue.issueType)}
            onClose={() => setOpenFix(null)}
          />
        </Render>
      </li>
    );
  };

  const renderPage = (page: PageScanResult) => (
    <div key={page.post.id} className={styles.pageCard}>
      <div className={styles.pageHeader}>
        <div className={styles.pageTitle}>
          <Text type={TextTypes.text} fontWeight={FontWeights.bold}>
            {page.post.title}
          </Text>
          <Link href={page.post.link} target="_blank">
            {pathOf(page.post.link)}
          </Link>
        </div>
        <div className={styles.pageMeta}>
          <Render if={page.score !== null}>
            <span className={classNames(styles.score, scoreClass(page.score))}>{page.score}%</span>
          </Render>
          <Button
            type={ButtonTypes.default}
            size={ButtonSizes.small}
            iconLeft={IconNames.refresh}
            onClick={() => recheck(page)}
            isLoading={recheckingId === page.post.id}
            disabled={recheckingId !== null}
          >
            {__("Recheck", "beyondseo")}
          </Button>
        </div>
      </div>
      <ul className={styles.issueList}>{page.issues.map((issue) => renderIssue(page, issue))}</ul>
    </div>
  );

  const renderResults = () => {
    if (!snapshot) {
      return null;
    }
    const analyzed = snapshot.pages.filter((page) => page.analyzed && !page.failed);
    const withIssues = analyzed
      .filter((page) => page.issues.length > 0)
      .sort((a, b) => (a.score ?? 0) - (b.score ?? 0));
    const issueCount = withIssues.reduce((sum, page) => sum + page.issues.length, 0);
    const incomplete = snapshot.pages.length - analyzed.length;

    return (
      <>
        <Render if={snapshot.outcome === "partial"}>
          <InfoBox
            type="warn"
            borderRadius={8}
            title={__("Some pages need another look", "beyondseo")}
            description={
              snapshot.loopbackSuspected
                ? __(
                    "Every page scored 0, which usually means the site could not load its own pages during the check. Make sure the site is reachable from its server, then run the scan again.",
                    "beyondseo",
                  )
                : sprintf(
                    /* translators: 1: number of pages that could not be checked, 2: total number of pages */
                    _n(
                      "%1$d of %2$d pages could not be checked. You can continue with the completed checks and try again later.",
                      "%1$d of %2$d pages could not be checked. You can continue with the completed checks and try again later.",
                      incomplete,
                      "beyondseo",
                    ),
                    incomplete,
                    snapshot.pages.length,
                  )
            }
          />
        </Render>
        <div className={styles.summary}>
          <Text type={TextTypes.text}>
            {sprintf(
              /* translators: %d: number of pages */
              _n("%d page checked", "%d pages checked", snapshot.scanned || analyzed.length, "beyondseo"),
              snapshot.scanned || analyzed.length,
            )}
          </Text>
          <Text type={TextTypes.text}>
            {sprintf(
              /* translators: %d: number of issues */
              _n("%d issue to review", "%d issues to review", issueCount, "beyondseo"),
              issueCount,
            )}
          </Text>
          <Render if={analyzed.length - withIssues.length > 0}>
            <Text type={TextTypes.text}>
              {sprintf(
                /* translators: %d: number of pages */
                _n(
                  "%d page without open issues",
                  "%d pages without open issues",
                  analyzed.length - withIssues.length,
                  "beyondseo",
                ),
                analyzed.length - withIssues.length,
              )}
            </Text>
          </Render>
        </div>
        {withIssues.map(renderPage)}
        <Render if={snapshot.pages.length >= 40}>
          <Text type={TextTypes.textHelp} className={shared.fine}>
            {__(
              "Showing the most recent pages and posts. Every other page is listed in the posts and pages overview.",
              "beyondseo",
            )}
          </Text>
        </Render>
      </>
    );
  };

  const renderBody = () => {
    if (phase === "scanning" || phase === "collecting") {
      return (
        <div className={styles.running}>
          <Text type={TextTypes.heading2} fontWeight={FontWeights.bold}>
            {__("Checking your site", "beyondseo")}
          </Text>
          <Text type={TextTypes.text} className={shared.description}>
            {phase === "scanning"
              ? __(
                  "Every published page and post is analysed on your server. This can take a few minutes on larger sites.",
                  "beyondseo",
                )
              : __("Collecting the results for your pages…", "beyondseo")}
          </Text>
          <Text type={TextTypes.textHelp} className={shared.fine}>
            {__("Analysing your published pages…", "beyondseo")}
          </Text>
        </div>
      );
    }

    if (phase === "done" && snapshot?.outcome === "error") {
      return (
        <>
          <div className={shared.intro}>
            <Text type={TextTypes.heading2} fontWeight={FontWeights.bold}>
              {__("The site check could not finish", "beyondseo")}
            </Text>
            <Text type={TextTypes.text} className={shared.description}>
              {__("Retry now, or continue and run the check later from the dashboard.", "beyondseo")}
            </Text>
          </div>
          <InfoBox type="danger" borderRadius={8} description={snapshot.errorMessage || describeError(null)} />
        </>
      );
    }

    if (phase === "done" && snapshot?.outcome === "empty") {
      return (
        <div className={shared.intro}>
          <Text type={TextTypes.heading2} fontWeight={FontWeights.bold}>
            {__("No supported issues found", "beyondseo")}
          </Text>
          <Text type={TextTypes.text} className={shared.description}>
            {__(
              "The available checks finished without finding an open issue. You can scan again after updating your site.",
              "beyondseo",
            )}
          </Text>
        </div>
      );
    }

    if (phase === "done" && snapshot) {
      const hasIssues = snapshot.pages.some((page) => page.analyzed && !page.failed && page.issues.length > 0);

      return (
        <>
          <div className={shared.intro}>
            <Text type={TextTypes.heading2} fontWeight={FontWeights.bold}>
              {hasIssues
                ? __("Issues found on your pages", "beyondseo")
                : __("No open issues on the checked pages", "beyondseo")}
            </Text>
            <Text type={TextTypes.text} className={shared.description}>
              {hasIssues
                ? __(
                    "Fix titles, descriptions and keywords right here, or open the page in the editor for everything else.",
                    "beyondseo",
                  )
                : __(
                    "The completed checks found nothing to fix. You can run the scan again after updating your site.",
                    "beyondseo",
                  )}
            </Text>
          </div>
          <Render if={!!notice}>
            <InfoBox type="warn" borderRadius={8} description={notice || ""} />
          </Render>
          {renderResults()}
        </>
      );
    }

    return (
      <>
        <div className={shared.intro}>
          <Text type={TextTypes.heading2} fontWeight={FontWeights.bold}>
            {__("Identify issues on your pages", "beyondseo")}
          </Text>
          <Text type={TextTypes.text} className={shared.description}>
            {__(
              "BeyondSEO checks your published pages and posts against the SEO essentials, then shows where to improve.",
              "beyondseo",
            )}
          </Text>
        </div>
        <Render if={!!notice}>
          <InfoBox type="warn" borderRadius={8} description={notice || ""} />
        </Render>
        <div className={shared.card}>
          <ul className={styles.checkList}>
            {getChecks().map((check) => (
              <li key={check}>
                <TextIcon
                  icon={IconNames.search}
                  iconColor="var(--n400)"
                  iconSize={IconSize.small}
                  textType={TextTypes.text}
                  verticalAlign="center"
                >
                  {check}
                </TextIcon>
              </li>
            ))}
          </ul>
        </div>
      </>
    );
  };

  const isRunning = phase === "scanning" || phase === "collecting";
  const canRerun = phase === "done" && snapshot?.outcome !== "results";

  return (
    <StepLayout
      footerStart={
        isRunning ? (
          <Button type={ButtonTypes.secondary} size={ButtonSizes.medium} onClick={cancel}>
            {__("Cancel", "beyondseo")}
          </Button>
        ) : (
          <Button
            type={ButtonTypes.secondary}
            size={ButtonSizes.medium}
            iconLeft={IconNames.arrowLeft}
            onClick={onBack}
          >
            {__("Back", "beyondseo")}
          </Button>
        )
      }
      footerEnd={
        <>
          <Render if={canRerun}>
            <Button type={ButtonTypes.secondary} size={ButtonSizes.medium} onClick={start}>
              {snapshot?.outcome === "error" ? __("Retry scan", "beyondseo") : __("Run scan again", "beyondseo")}
            </Button>
          </Render>
          {phase === "done" ? (
            <Button type={ButtonTypes.primary} size={ButtonSizes.medium} onClick={onNext}>
              {__("Continue", "beyondseo")}
            </Button>
          ) : (
            <Button
              type={ButtonTypes.primary}
              size={ButtonSizes.medium}
              onClick={start}
              isLoading={isRunning}
              disabled={isRunning}
            >
              {isRunning ? __("Scanning…", "beyondseo") : __("Start scan", "beyondseo")}
            </Button>
          )}
        </>
      }
    >
      {renderBody()}
    </StepLayout>
  );
};
