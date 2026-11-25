import * as React from "react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { __ } from "@wordpress/i18n";
import { Button, ButtonSizes, ButtonTypes, classNames, Icon, IconNames, IconSize } from "vanguard";
import { RootState } from "@src/main.store";
import { isUnsavedNewPost } from "@helpers/post-helpers";
import {
  requestScoreRecalculation,
  useScoreRecalculationAvailable,
  useScoreRecalculationScheduled,
} from "@helpers/score-recalculation";
import styles from "./RecalculateScoreButton.module.scss";

interface EditorState {
  blockEditor: boolean;
  dirty: boolean;
  saving: boolean;
  saveable: boolean;
  locked: boolean;
  published: boolean;
  unsavedNew: boolean;
}

const SAVE_SETTLE_TIMEOUT_MS = 30000;

const isBlockEditorPage = (): boolean =>
  document.body.classList.contains("block-editor-page") && typeof wp !== "undefined" && !!wp.data?.subscribe;

const readEditorState = (): EditorState => {
  const editor = isBlockEditorPage() ? wp.data.select("core/editor") : null;
  const unsavedNew = isUnsavedNewPost();
  if (!editor || !(Number(editor.getCurrentPostId?.() ?? 0) > 0)) {
    return {
      blockEditor: false,
      dirty: false,
      saving: false,
      saveable: false,
      locked: false,
      published: false,
      unsavedNew,
    };
  }
  const saving = editor.isSavingPost();
  return {
    blockEditor: true,
    dirty: editor.isEditedPostDirty(),
    saving: saving && !editor.isAutosavingPost(),
    // core reports "not saveable" for the whole duration of any save, autosaves included
    saveable: editor.isEditedPostSaveable() || saving,
    locked: editor.isPostSavingLocked(),
    published: editor.getCurrentPost()?.status === "publish",
    unsavedNew,
  };
};

const sameEditorState = (a: EditorState, b: EditorState): boolean =>
  (Object.keys(a) as Array<keyof EditorState>).every((key) => a[key] === b[key]);

// savePost() resolves when the request is done; the store flag is the fallback for editors that resolve early
const waitForSaveToSettle = (): Promise<void> =>
  new Promise((resolve) => {
    const editor = wp.data.select("core/editor");
    if (!editor?.isSavingPost()) {
      resolve();
      return;
    }
    let unsubscribe: (() => void) | null = null;
    let timer: ReturnType<typeof setTimeout> | null = null;
    const done = () => {
      if (timer) clearTimeout(timer);
      unsubscribe?.();
      resolve();
    };
    timer = setTimeout(done, SAVE_SETTLE_TIMEOUT_MS);
    unsubscribe = wp.data.subscribe(() => {
      if (!editor.isSavingPost()) done();
    });
  });

export interface RecalculateScoreButtonProps {
  className?: string;
  /** "icon": a wordless segment for the score pill, shown only while there is something to save or in progress */
  variant?: "button" | "icon";
  size?: ButtonSizes;
  testId?: string;
}

export const RecalculateScoreButton: React.FC<RecalculateScoreButtonProps> = ({
  className,
  variant = "button",
  size = ButtonSizes.small,
  testId = "rc-recalculate-score-button",
}) => {
  const available = useScoreRecalculationAvailable();
  const scheduled = useScoreRecalculationScheduled();
  const isRecalculatingScore = useSelector((state: RootState) => state.app.pendingScoreRecalculations > 0);
  const [editor, setEditor] = useState<EditorState>(readEditorState);
  const [savingFromButton, setSavingFromButton] = useState(false);

  useEffect(() => {
    if (!isBlockEditorPage()) return;
    const sync = () => {
      const next = readEditorState();
      setEditor((previous) => (sameEditorState(previous, next) ? previous : next));
    };
    sync();
    return wp.data.subscribe(sync);
  }, []);

  if (!available) return null;

  const { blockEditor, dirty, saving, saveable, locked, published, unsavedNew } = editor;
  const isSaving = savingFromButton || saving;
  const busy = isSaving || scheduled || isRecalculatingScore;
  const needsSave = isSaving || (blockEditor && dirty);
  const compact = variant === "icon";

  if (compact && !needsSave && !busy) return null;

  // While busy the loading state already ignores clicks; staying enabled keeps keyboard focus on the button
  const disabled = !busy && (dirty ? !saveable || locked : unsavedNew);

  const idleLabel = needsSave
    ? published
      ? __("Update & recalculate", "beyondseo")
      : __("Save & recalculate", "beyondseo")
    : __("Recalculate", "beyondseo");
  const label = isSaving ? __("Saving…", "beyondseo") : busy ? __("Recalculating…", "beyondseo") : idleLabel;
  const idleTitle = needsSave
    ? published
      ? __("Update the post and recalculate the SEO score", "beyondseo")
      : __("Save your changes and recalculate the SEO score", "beyondseo")
    : __("Recalculate the SEO score of the saved content", "beyondseo");
  const title = isSaving
    ? __("Saving your changes…", "beyondseo")
    : busy
      ? __("Recalculating the SEO score…", "beyondseo")
      : idleTitle;

  const handleClick = async (event: React.MouseEvent) => {
    event.stopPropagation();
    if (busy) return;
    if (blockEditor && dirty) {
      setSavingFromButton(true);
      try {
        await wp.data.dispatch("core/editor")?.savePost();
        await waitForSaveToSettle();
      } catch {
        // the editor store reports the outcome below
      }
      setSavingFromButton(false);
      if (!wp.data.select("core/editor")?.didPostSaveRequestSucceed()) return;
    }
    requestScoreRecalculation();
  };

  if (compact) {
    return (
      <button
        type="button"
        className={classNames(styles.iconButton, busy && styles.busy, className)}
        title={title}
        aria-label={title}
        aria-busy={busy || undefined}
        disabled={disabled}
        onClick={handleClick}
        data-testid={testId}
      >
        <Icon type={IconSize.small} color="var(--p500)" spin={busy}>
          {IconNames.refresh}
        </Icon>
      </button>
    );
  }

  return (
    <span className={styles.wrapper} title={title} aria-busy={busy || undefined}>
      <Button
        type={ButtonTypes.secondary}
        size={size}
        iconLeft={IconNames.refresh}
        isLoading={busy}
        disabled={disabled}
        onClick={handleClick}
        testId={testId}
        className={classNames(styles.button, className)}
      >
        {label}
      </Button>
    </span>
  );
};
