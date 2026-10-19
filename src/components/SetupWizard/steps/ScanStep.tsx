import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { __, _n, sprintf } from "@wordpress/i18n";
import {
  Button,
  ButtonSizes,
  ButtonTypes,
  classNames,
  FontWeights,
  Icon,
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
import {
  fixActionLabel,
  fixKindForIssue,
  FixKind,
  getWizardChecks,
  priorityLabel,
  WizardCheck,
} from "../issue-mapping";
import {
  ContentItem,
  getOptimiserResult,
  listScannableContent,
  PageScanResult,
  rerunOptimiser,
  runSiteScan,
  toPageScanResult,
  WizardRequestError,
} from "../setup-wizard-api";
import { IssueFixPanel } from "./IssueFixPanel";
import { KeywordsPanel } from "./KeywordsPanel";
import shared from "../SetupWizard.module.scss";
import styles from "./ScanStep.module.scss";

export type ScanOutcome = "results" | "empty" | "partial" | "error";

export interface ScanSnapshot {
  outcome: ScanOutcome;
  scanned: number;
  pages: PageScanResult[];
  /** `${postId}:${issueType}` of fixes saved inline and not rechecked yet. */
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

interface CheckResult {
  check: WizardCheck;
  pages: PageScanResult[];
}

type Phase = "idle" | "scanning" | "collecting" | "done";

const RESULT_BATCH_SIZE = 4;

const issueKey = (postId: number, issueType: string): string => `${postId}:${issueType}`;

const analyzedPages = (pages: PageScanResult[]): PageScanResult[] =>
  pages.filter((page) => page.analyzed && !page.failed);

/** Every wizard check with the analysed pages that failed it; checks with affected pages first, catalogue order within. */
const groupByCheck = (pages: PageScanResult[]): CheckResult[] => {
  const analyzed = analyzedPages(pages);
  const results = getWizardChecks().map((check) => ({
    check,
    pages: analyzed.filter((page) => page.issues.some((issue) => issue.issueType === check.issueType)),
  }));

  return [
    ...results.filter((result) => result.pages.length > 0),
    ...results.filter((result) => result.pages.length === 0),
  ];
};

const buildSnapshot = (scanned: number, pages: PageScanResult[], fixedKeys: string[] = []): ScanSnapshot => {
  const analyzed = analyzedPages(pages);
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
  const [collapsed, setCollapsed] = useState<string[]>([]);
  const [openFix, setOpenFix] = useState<{
    post: ContentItem;
    issueType: string;
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
    setCollapsed([]);
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

  const toggleCheck = (issueType: string) =>
    setCollapsed((current) =>
      current.includes(issueType) ? current.filter((entry) => entry !== issueType) : [...current, issueType],
    );

  const markFixed = (postId: number, issueType: string) => {
    if (snapshot && !snapshot.fixedKeys.includes(issueKey(postId, issueType))) {
      onSnapshot({ ...snapshot, fixedKeys: [...snapshot.fixedKeys, issueKey(postId, issueType)] });
    }
  };

  const closeFix = () => setOpenFix(null);

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

  const renderPageRow = (check: WizardCheck, page: PageScanResult) => {
    const kind = fixKindForIssue(check.issueType);
    const fixed = snapshot?.fixedKeys.includes(issueKey(page.post.id, check.issueType));
    const isOpen = openFix?.post.id === page.post.id && openFix.issueType === check.issueType;

    return (
      <li key={page.post.id} className={styles.pageRow}>
        <div className={styles.pageInfo}>
          <div className={styles.pageTitleRow}>
            <Text type={TextTypes.text} fontWeight={FontWeights.medium}>
              {page.post.title}
            </Text>
            <Render if={page.score !== null}>
              <span className={classNames(styles.score, scoreClass(page.score))}>{page.score}%</span>
            </Render>
          </div>
          <Link href={page.post.link} target="_blank">
            {pathOf(page.post.link)}
          </Link>
        </div>
        <div className={styles.pageActions}>
          {fixed ? (
            <TextIcon
              icon={IconNames.check}
              iconColor="var(--s500)"
              iconSize={IconSize.small}
              textType={TextTypes.textHelp}
              verticalAlign="center"
            >
              {__("Updated", "beyondseo")}
            </TextIcon>
          ) : kind === "editor" ? (
            <Link href={page.post.editLink} target="_blank">
              {fixActionLabel(kind)}
            </Link>
          ) : (
            <Button
              type={ButtonTypes.secondary}
              size={ButtonSizes.small}
              onClick={() => setOpenFix(isOpen ? null : { post: page.post, issueType: check.issueType, kind })}
            >
              {fixActionLabel(kind)}
            </Button>
          )}
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
        <Render if={isOpen}>
          {openFix?.kind === "keywords" ? (
            <KeywordsPanel
              post={page.post}
              onChanged={() => markFixed(page.post.id, check.issueType)}
              onClose={closeFix}
            />
          ) : (
            <IssueFixPanel
              post={page.post}
              kind={openFix?.kind === "description" ? "description" : "title"}
              onSaved={() => {
                markFixed(page.post.id, check.issueType);
                closeFix();
              }}
              onClose={closeFix}
            />
          )}
        </Render>
      </li>
    );
  };

  const renderCheck = ({ check, pages }: CheckResult) => {
    const affected = pages.length > 0;
    const isOpen = affected && !collapsed.includes(check.issueType);

    return (
      <div
        key={check.issueType}
        className={classNames(styles.checkCard, affected ? undefined : styles.checkCardPassed)}
      >
        <div className={styles.checkHeader}>
          <span className={styles.checkIcon}>
            <Icon type={IconSize.small} color={affected ? "var(--w500)" : "var(--s500)"}>
              {affected ? IconNames.warning : IconNames.check}
            </Icon>
          </span>
          <div className={styles.checkText}>
            <div className={styles.checkTitleRow}>
              <Text type={TextTypes.text} fontWeight={FontWeights.bold}>
                {check.title}
              </Text>
              <Render if={affected}>
                <span
                  className={classNames(styles.priority, check.priority === 1 ? styles.priorityCritical : undefined)}
                >
                  {priorityLabel(check.priority)}
                </span>
              </Render>
            </div>
            <Render if={affected}>
              <Text type={TextTypes.textHelp} className={shared.fine}>
                {check.description}
              </Text>
            </Render>
          </div>
          <div className={styles.checkMeta}>
            {affected ? (
              <Button
                type={ButtonTypes.default}
                size={ButtonSizes.small}
                iconRight={isOpen ? IconNames.caretUp : IconNames.caretDown}
                onClick={() => toggleCheck(check.issueType)}
                aria-expanded={isOpen}
              >
                {sprintf(
                  /* translators: %d: number of pages */
                  _n("%d page affected", "%d pages affected", pages.length, "beyondseo"),
                  pages.length,
                )}
              </Button>
            ) : (
              <Text type={TextTypes.textHelp} className={shared.fine}>
                {__("All checked pages pass", "beyondseo")}
              </Text>
            )}
          </div>
        </div>
        <Render if={isOpen}>
          <ul className={styles.pageList}>{pages.map((page) => renderPageRow(check, page))}</ul>
        </Render>
      </div>
    );
  };

  const renderResults = () => {
    if (!snapshot) {
      return null;
    }
    const analyzed = analyzedPages(snapshot.pages);
    const results = groupByCheck(snapshot.pages);
    const failing = results.filter((result) => result.pages.length > 0);
    const incomplete = snapshot.pages.length - analyzed.length;

    return (
      <>
        <div className={shared.intro}>
          <Text type={TextTypes.heading2} fontWeight={FontWeights.bold}>
            {failing.length > 0
              ? __("Issues found on your pages", "beyondseo")
              : __("Your pages pass every check", "beyondseo")}
          </Text>
          <Text type={TextTypes.text} className={shared.description}>
            {failing.length > 0
              ? __(
                  "Each check lists the pages it applies to. Fix titles, descriptions and keywords right here, or open the page in the editor for everything else.",
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
              /* translators: 1: number of checks with affected pages, 2: total number of checks */
              _n(
                "%1$d of %2$d checks needs attention",
                "%1$d of %2$d checks need attention",
                failing.length,
                "beyondseo",
              ),
              failing.length,
              results.length,
            )}
          </Text>
          <Text type={TextTypes.text}>
            {sprintf(
              /* translators: %d: number of pages */
              _n("%d page checked", "%d pages checked", snapshot.scanned || analyzed.length, "beyondseo"),
              snapshot.scanned || analyzed.length,
            )}
          </Text>
        </div>
        <div className={styles.checks}>{results.map(renderCheck)}</div>
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

    if (phase === "done" && snapshot) {
      return renderResults();
    }

    return (
      <>
        <div className={shared.intro}>
          <Text type={TextTypes.heading2} fontWeight={FontWeights.bold}>
            {__("Identify issues on your pages", "beyondseo")}
          </Text>
          <Text type={TextTypes.text} className={shared.description}>
            {__(
              "BeyondSEO checks every published page and post for the following, then shows which pages need work.",
              "beyondseo",
            )}
          </Text>
        </div>
        <Render if={!!notice}>
          <InfoBox type="warn" borderRadius={8} description={notice || ""} />
        </Render>
        <div className={shared.card}>
          <ul className={styles.checkList}>
            {getWizardChecks().map((check) => (
              <li key={check.issueType}>
                <TextIcon
                  icon={IconNames.search}
                  iconColor="var(--n400)"
                  iconSize={IconSize.small}
                  textType={TextTypes.text}
                  verticalAlign="center"
                >
                  {check.title}
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
