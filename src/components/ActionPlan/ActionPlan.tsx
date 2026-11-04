import * as React from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { __, sprintf } from "@wordpress/i18n";
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
  Skeleton,
  Text,
  TextTypes,
} from "vanguard";
import { rcWindow } from "@stores/window.store";
import { fixActionLabel, fixKindForIssue, FixKind, priorityLabel } from "@components/SetupWizard/issue-mapping";
import { rerunOptimiser, runSiteScan, WizardRequestError } from "@components/SetupWizard/setup-wizard-api";
import { IssueFixPanel } from "@components/SetupWizard/steps/IssueFixPanel";
import { KeywordsPanel } from "@components/SetupWizard/steps/KeywordsPanel";
import { ActionPlan as ActionPlanData, ActionPlanIssue, getActionPlan, issueKey } from "./action-plan-api";
import styles from "./ActionPlan.module.scss";

interface OpenFix {
  key: string;
  kind: Exclude<FixKind, "editor">;
}

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

const formatCheckTime = (timestamp: number): string => {
  const locale = String(rcWindow?.rankingCoachReactData?.locale || "").replace("_", "-") || undefined;
  try {
    return new Date(timestamp * 1000).toLocaleString(locale, { dateStyle: "medium", timeStyle: "short" });
  } catch {
    return new Date(timestamp * 1000).toLocaleString();
  }
};

const describeError = (error: unknown, fallback: string): string => {
  if (error instanceof WizardRequestError && error.code === "rankingcoach_circuit_breaker_open") {
    return error.message;
  }
  if (error instanceof WizardRequestError && error.status >= 500) {
    return __(
      "The site check could not finish on the server. Large sites can take longer than the server allows.",
      "beyondseo",
    );
  }

  return fallback;
};

/**
 * The Action Plan page: every setup wizard check a published page failed in its latest analysis,
 * critical first. Titles, descriptions and keywords are fixed inline (the wizard's panels) and the
 * page is rechecked right after a fix; everything else opens the editor. The data is the stored
 * analysis, so "Check all pages again" is the only call that analyses anything on its own.
 */
export const ActionPlan: React.FC = () => {
  const [plan, setPlan] = useState<ActionPlanData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [openFix, setOpenFix] = useState<OpenFix | null>(null);
  const [recheckingId, setRecheckingId] = useState<number | null>(null);
  const changedPostIds = useRef(new Set<number>());
  const checkAbortRef = useRef<AbortController | null>(null);
  const mountedRef = useRef(true);

  const load = useCallback(async (signal?: AbortSignal) => {
    try {
      const next = await getActionPlan(signal);
      if (!signal?.aborted && mountedRef.current) {
        setPlan(next);
        setLoadError(null);
      }
    } catch (error) {
      if (!signal?.aborted && mountedRef.current) {
        setLoadError(
          error instanceof WizardRequestError && error.message
            ? error.message
            : __("The action plan could not be loaded.", "beyondseo"),
        );
      }
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    const controller = new AbortController();
    load(controller.signal).finally(() => {
      if (!controller.signal.aborted && mountedRef.current) {
        setIsLoading(false);
      }
    });

    return () => {
      mountedRef.current = false;
      controller.abort();
      checkAbortRef.current?.abort();
    };
  }, [load]);

  const retryLoad = async () => {
    setIsLoading(true);
    await load();
    if (mountedRef.current) {
      setIsLoading(false);
    }
  };

  const checkAllPages = async () => {
    const controller = new AbortController();
    checkAbortRef.current = controller;
    setNotice(null);
    setOpenFix(null);
    setIsChecking(true);
    try {
      await runSiteScan(controller.signal);
      await load();
    } catch (error) {
      if (!mountedRef.current) {
        return;
      }
      setNotice(
        controller.signal.aborted
          ? __(
              "Check cancelled. A page analysis that already started on the server will still finish in the background.",
              "beyondseo",
            )
          : describeError(error, __("We could not complete the site check.", "beyondseo")),
      );
    } finally {
      if (mountedRef.current) {
        setIsChecking(false);
      }
    }
  };

  const cancelCheck = () => checkAbortRef.current?.abort();

  const recheck = async (postId: number) => {
    setRecheckingId(postId);
    setNotice(null);
    try {
      await rerunOptimiser(postId);
      changedPostIds.current.delete(postId);
      await load();
    } catch {
      if (mountedRef.current) {
        setNotice(__("The page could not be rechecked. Please try again in a moment.", "beyondseo"));
      }
    } finally {
      if (mountedRef.current) {
        setRecheckingId(null);
      }
    }
  };

  const toggleFix = (issue: ActionPlanIssue, kind: Exclude<FixKind, "editor">) => {
    const key = issueKey(issue);
    setOpenFix((current) => (current?.key === key ? null : { key, kind }));
  };

  /** Closing the keywords panel after a change rechecks the page, like a saved title or description does. */
  const closeKeywords = (postId: number) => {
    setOpenFix(null);
    if (changedPostIds.current.has(postId)) {
      void recheck(postId);
    }
  };

  const pagesAffected = useMemo(() => new Set((plan?.issues || []).map((issue) => issue.post.id)).size, [plan]);

  const renderIssue = (issue: ActionPlanIssue) => {
    const key = issueKey(issue);
    const kind = fixKindForIssue(issue.issueType);
    const isOpen = openFix?.key === key;
    const isBusy = recheckingId === issue.post.id;
    const actionsDisabled = recheckingId !== null || isChecking;

    return (
      <li
        key={key}
        className={classNames(styles.issue, isBusy ? styles.issueBusy : undefined)}
        data-testid="rc-action-plan-issue"
      >
        <div className={styles.issueMain}>
          <span className={styles.issueIcon}>
            <Icon type={IconSize.small} color={issue.priority === 1 ? "var(--e500)" : "var(--w500)"}>
              {IconNames.warning}
            </Icon>
          </span>
          <div className={styles.issueText}>
            <div className={styles.issueTitleRow}>
              <Text type={TextTypes.text} fontWeight={FontWeights.bold}>
                {issue.title}
              </Text>
              <span className={classNames(styles.priority, issue.priority === 1 ? styles.priorityCritical : undefined)}>
                {priorityLabel(issue.priority)}
              </span>
            </div>
            <Text type={TextTypes.textHelp} className={styles.fine}>
              {issue.description}
            </Text>
            <div className={styles.pageLine}>
              <Text type={TextTypes.text} fontWeight={FontWeights.medium}>
                {issue.post.title}
              </Text>
              <Render if={!!issue.post.link}>
                <Link href={issue.post.link} target="_blank">
                  {pathOf(issue.post.link)}
                </Link>
              </Render>
              <Render if={issue.post.score !== null}>
                <span className={classNames(styles.score, scoreClass(issue.post.score))}>{issue.post.score}%</span>
              </Render>
            </div>
          </div>
        </div>
        <div className={styles.issueActions}>
          {kind === "editor" ? (
            <Link href={issue.post.editLink} target="_blank">
              {fixActionLabel(kind)}
            </Link>
          ) : (
            <Button
              type={ButtonTypes.secondary}
              size={ButtonSizes.small}
              onClick={() => toggleFix(issue, kind)}
              disabled={actionsDisabled}
            >
              {fixActionLabel(kind)}
            </Button>
          )}
          <Button
            type={ButtonTypes.default}
            size={ButtonSizes.small}
            iconLeft={IconNames.refresh}
            onClick={() => recheck(issue.post.id)}
            isLoading={isBusy}
            disabled={actionsDisabled}
          >
            {__("Recheck", "beyondseo")}
          </Button>
        </div>
        <Render if={isOpen}>
          <div className={styles.panel}>
            {openFix?.kind === "keywords" ? (
              <KeywordsPanel
                post={issue.post}
                onChanged={() => changedPostIds.current.add(issue.post.id)}
                onClose={() => closeKeywords(issue.post.id)}
              />
            ) : (
              <IssueFixPanel
                post={issue.post}
                kind={openFix?.kind === "description" ? "description" : "title"}
                onSaved={() => {
                  setOpenFix(null);
                  void recheck(issue.post.id);
                }}
                onClose={() => setOpenFix(null)}
              />
            )}
          </div>
        </Render>
      </li>
    );
  };

  const renderSummary = (data: ActionPlanData) => (
    <div className={styles.summary} data-testid="rc-action-plan-summary">
      <div className={styles.stat}>
        <span className={styles.statLabel}>{__("Open issues", "beyondseo")}</span>
        <span className={styles.statValue}>{data.issues.length}</span>
      </div>
      <div className={styles.stat}>
        <span className={styles.statLabel}>{__("Pages affected", "beyondseo")}</span>
        <span className={styles.statValue}>{pagesAffected}</span>
      </div>
      <div className={styles.stat}>
        <span className={styles.statLabel}>{__("Pages checked", "beyondseo")}</span>
        <span className={styles.statValue}>{data.pagesChecked}</span>
      </div>
      <div className={styles.stat}>
        <span className={styles.statLabel}>{__("Last check", "beyondseo")}</span>
        <span className={classNames(styles.statValue, styles.statValueSmall)}>
          {data.lastCheckAt ? formatCheckTime(data.lastCheckAt) : __("Not yet", "beyondseo")}
        </span>
      </div>
    </div>
  );

  const renderBody = (data: ActionPlanData) => {
    if (data.pagesChecked === 0) {
      return (
        <div className={styles.empty} data-testid="rc-action-plan-empty">
          <Icon type={IconSize.medium} color="var(--n400)">
            {IconNames.search}
          </Icon>
          <Text type={TextTypes.heading4} fontWeight={FontWeights.bold}>
            {__("Your pages have not been checked yet", "beyondseo")}
          </Text>
          <Text type={TextTypes.text} className={styles.description}>
            {__(
              "Check your published pages and posts to see which of them need a title, a description, keywords or headings.",
              "beyondseo",
            )}
          </Text>
        </div>
      );
    }

    if (data.issues.length === 0) {
      return (
        <div className={styles.empty} data-testid="rc-action-plan-empty">
          <Icon type={IconSize.medium} color="var(--s500)">
            {IconNames.check}
          </Icon>
          <Text type={TextTypes.heading4} fontWeight={FontWeights.bold}>
            {__("Your pages pass every check", "beyondseo")}
          </Text>
          <Text type={TextTypes.text} className={styles.description}>
            {__("Nothing is open right now. Check again after you publish or update pages.", "beyondseo")}
          </Text>
        </div>
      );
    }

    return <ul className={styles.list}>{data.issues.map(renderIssue)}</ul>;
  };

  return (
    <div className={styles.page} data-testid="rc-action-plan">
      <div className={styles.header}>
        <Text type={TextTypes.heading2} fontWeight={FontWeights.bold}>
          {__("Your SEO Action Plan", "beyondseo")}
        </Text>
        <Text type={TextTypes.text} className={styles.description}>
          {__(
            "Each action opens a fix for the named page. Issues stay open until the page is updated and rechecked.",
            "beyondseo",
          )}
        </Text>
      </div>
      {isLoading ? (
        <div className={styles.placeholder} data-testid="rc-action-plan-loading">
          <Skeleton width="100%" height="72px" />
          <Skeleton width="40%" height="36px" />
          <Skeleton width="100%" height="96px" />
          <Skeleton width="100%" height="96px" />
        </div>
      ) : loadError || !plan ? (
        <>
          <InfoBox type="danger" borderRadius={8} description={loadError || ""} />
          <div className={styles.toolbarActions}>
            <Button type={ButtonTypes.secondary} size={ButtonSizes.medium} onClick={retryLoad}>
              {__("Try again", "beyondseo")}
            </Button>
          </div>
        </>
      ) : (
        <>
          {renderSummary(plan)}
          <div className={styles.toolbar}>
            <Text type={TextTypes.textHelp} className={styles.fine}>
              {isChecking
                ? __(
                    "Every published page and post is analysed on your server. This can take a few minutes.",
                    "beyondseo",
                  )
                : __("Results come from the latest check of each page.", "beyondseo")}
            </Text>
            <div className={styles.toolbarActions}>
              <Render if={isChecking}>
                <Button type={ButtonTypes.default} size={ButtonSizes.medium} onClick={cancelCheck}>
                  {__("Cancel", "beyondseo")}
                </Button>
              </Render>
              <Button
                type={plan.pagesChecked === 0 ? ButtonTypes.primary : ButtonTypes.secondary}
                size={ButtonSizes.medium}
                iconLeft={IconNames.refresh}
                onClick={checkAllPages}
                isLoading={isChecking}
                disabled={isChecking || recheckingId !== null}
              >
                {plan.pagesChecked === 0
                  ? __("Check all pages", "beyondseo")
                  : __("Check all pages again", "beyondseo")}
              </Button>
            </div>
          </div>
          <Render if={!!notice}>
            <InfoBox type="warn" borderRadius={8} description={notice || ""} />
          </Render>
          {renderBody(plan)}
        </>
      )}
    </div>
  );
};
