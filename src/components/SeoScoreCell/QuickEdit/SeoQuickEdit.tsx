import * as React from "react";
import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { firstValueFrom } from "rxjs";
import { __ } from "@wordpress/i18n";
import {
  Button,
  ButtonSizes,
  ButtonTypes,
  classNames,
  FontWeights,
  InfoBox,
  Link,
  Render,
  Text,
  Textarea,
} from "vanguard";
import { metatagsStore } from "@stores/swagger/api/MetatagsStore";
import { wpVariablesStore } from "@stores/wp-variables.store";
import { MetaTagsPostRequestDto } from "@models/swagger/BeyondSEO/Presentation/Api/Client/Integrations/WordPress/Dtos/MetaTagsPostRequestDto";
import { MetaTagsApiResponse, MetaTagsSaveRequest, StructuredTemplate, WPVariableData } from "@src/types/meta-tags";
import {
  adornmentsToTemplate,
  buildVariablesMap,
  normalizeTemplate,
  resolveAdornments,
  resolveTemplate,
  templateIsEmpty,
  templateToAdornments,
  textToTemplate,
} from "@helpers/template-helpers";
import {
  Adornment,
  AdornmentConfig,
  MultiSelectAdornmentInput,
} from "@components/MultiAdornmentInput/MultiSelectAdornmentInput";
import {
  SeparatorOptions,
  VariableOptions,
} from "@components/SEOMetadataAndKeywords/SEOMetadata/SEOMetaTitleEditor/AdornmentOptions";
import { SeoSnippetData, templateEditableText } from "../snippet-data";
import { useAnchoredPosition } from "./useAnchoredPosition";
import styles from "./SeoQuickEdit.module.scss";

/** Recommended lengths, identical to the General tab editors. */
export const TITLE_MAX_LENGTH = 120;
export const DESCRIPTION_MAX_LENGTH = 300;

const PANEL_WIDTH = 440;
const DEFAULT_ARROW_OFFSET = 28;

/** Set on `body` while the card is open; the stylesheet lifts portalled menus above the card with it. */
const OPEN_BODY_CLASS = "rc-seo-quick-edit-open";

/**
 * Containers Vanguard / MUI render outside the card (select menus, tooltips).
 * A click in one of them belongs to the card and must not trigger the
 * click-outside save.
 */
const PORTAL_SELECTORS =
  '.MuiPopover-root, .MuiMenu-root, .MuiPopper-root, .MuiModal-root, .vanguard-popover, [role="listbox"], [role="presentation"]';

const variableConfig: AdornmentConfig = {
  options: VariableOptions,
  buttonText: __("Add Variable", "beyondseo"),
};

const separatorConfig: AdornmentConfig = {
  options: SeparatorOptions,
  buttonText: __("Add Separator", "beyondseo"),
};

export interface SeoQuickEditResult {
  title: string;
  titleTemplate: StructuredTemplate;
  description: string;
  descriptionTemplate: StructuredTemplate;
}

export interface SeoQuickEditProps {
  postId: number;
  snippet: SeoSnippetData;
  /** Element the card is anchored to; clicks inside it are handled by the owner. */
  anchorRef: React.RefObject<HTMLElement | null>;
  /** Close without saving. */
  onClose: () => void;
  /** Called after a successful save with the new snippet; the owner closes the card. */
  onSaved: (result: SeoQuickEditResult) => void;
}

/** Imperative surface for the owning cell (e.g. the edit button while the card is open). */
export interface SeoQuickEditHandle {
  saveAndClose: () => Promise<void>;
}

/** Order-independent comparison of two structured templates. */
const canonicalTemplate = (template: StructuredTemplate): string =>
  JSON.stringify(
    template.map((element) =>
      element.type === "text" ? { type: "text", content: element.content } : { type: element.type, key: element.key },
    ),
  );

/** Template stored by the server for a field, falling back to what was sent. */
const savedTemplate = (
  response: MetaTagsApiResponse | undefined,
  key: "title" | "description",
  sent: StructuredTemplate,
): StructuredTemplate => {
  const fromResponse = response?.[key]?.template;
  if (fromResponse === undefined) {
    return sent;
  }
  const normalized = normalizeTemplate(fromResponse);
  return normalized.length > 0 || sent.length === 0 ? normalized : sent;
};

const extractErrorMessage = (error: any): string => {
  const message = error?.response?.data?.message || error?.response?.data?.error || error?.message;
  return typeof message === "string" && message.trim() !== ""
    ? message
    : __("Your changes could not be saved. Please try again.", "beyondseo");
};

const isInsidePortal = (target: EventTarget | null): boolean => {
  const element = target instanceof Element ? target : ((target as Node | null)?.parentElement ?? null);
  return !!element?.closest(PORTAL_SELECTORS);
};

/**
 * Floating quick editor for a post's SEO title and meta description, opened
 * from the assistant column of the posts/pages list.
 *
 * The title uses the same chip editor as the General tab (variables and
 * separators included); the description the same textarea and counter. Saving
 * goes through the metatags endpoint with only the changed fields; clicking
 * anywhere outside saves and closes, Cancel/Escape discards.
 *
 * Rendered in a portal on `document.body` so the list table never clips it;
 * state is local and never touches the shared redux metatags state, which
 * belongs to the single post of the editor screens.
 */
export const SeoQuickEdit = forwardRef<SeoQuickEditHandle, SeoQuickEditProps>(
  ({ postId, snippet, anchorRef, onClose, onSaved }, ref) => {
    const panelRef = useRef<HTMLDivElement>(null);
    const hasFocusedRef = useRef(false);
    const position = useAnchoredPosition(anchorRef, panelRef, true, PANEL_WIDTH);

    // Title: chip editor state. When nothing is stored yet the editor seeds the
    // post title, so that is the baseline no save is compared against.
    const initialAdornments = useMemo(() => templateToAdornments(snippet.titleTemplate), [snippet.titleTemplate]);
    const baselineTitleTemplate = useMemo<StructuredTemplate>(
      () => (snippet.titleTemplate.length > 0 ? snippet.titleTemplate : textToTemplate(snippet.postTitle)),
      [snippet.titleTemplate, snippet.postTitle],
    );
    const [titleAdornments, setTitleAdornments] = useState<Adornment[]>(initialAdornments);
    const titleTemplate = useMemo(() => adornmentsToTemplate(titleAdornments), [titleAdornments]);

    const initialDescription = useMemo(
      () => templateEditableText(snippet.descriptionTemplate, snippet.description),
      [snippet.descriptionTemplate, snippet.description],
    );
    const [description, setDescription] = useState(initialDescription);

    // WordPress variables resolve the chips into text for the character count.
    const [variables, setVariables] = useState<WPVariableData[] | null>(null);
    const variablesMap = useMemo(() => buildVariablesMap(variables), [variables]);
    const titlePreview = useMemo(
      () => resolveAdornments(titleAdornments, variablesMap),
      [titleAdornments, variablesMap],
    );

    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const titleChanged = canonicalTemplate(titleTemplate) !== canonicalTemplate(baselineTitleTemplate);
    const titleValid = !templateIsEmpty(titleTemplate);
    const descriptionChanged = description.trim() !== initialDescription.trim();
    const isDirty = (titleChanged && titleValid) || descriptionChanged;

    useEffect(() => {
      let cancelled = false;

      firstValueFrom(wpVariablesStore.getVariablesByPostId(postId))
        .then((result) => {
          if (!cancelled) {
            setVariables(Array.isArray(result?.response) ? result.response : []);
          }
        })
        .catch(() => {
          if (!cancelled) {
            setVariables([]);
          }
        });

      return () => {
        cancelled = true;
      };
    }, [postId]);

    // Vanguard's Select menus (Add Variable / Add Separator, chip selectors) are MUI popovers
    // portalled onto `body` at MUI's modal layer, below this card's own layer, so they opened
    // behind the card and its focus trap then locked the card until the hidden menu closed.
    // While the card is open, a body class lifts those layers above it (see the stylesheet).
    useEffect(() => {
      document.body.classList.add(OPEN_BODY_CLASS);
      return () => {
        document.body.classList.remove(OPEN_BODY_CLASS);
      };
    }, []);

    // Focus the title once the card is positioned (a hidden element cannot take focus).
    useEffect(() => {
      if (!position || hasFocusedRef.current) {
        return;
      }
      hasFocusedRef.current = true;
      const titleInput = panelRef.current?.querySelector<HTMLInputElement>("input");
      titleInput?.focus();
      titleInput?.setSelectionRange?.(titleInput.value.length, titleInput.value.length);
    }, [position]);

    /** Save the changed fields. Resolves true when nothing had to be saved or the save succeeded. */
    const persist = useCallback(async (): Promise<boolean> => {
      if (!isDirty) {
        return true;
      }
      if (isSaving) {
        return false;
      }

      setIsSaving(true);
      setError(null);

      const nextDescriptionTemplate = textToTemplate(description.trim());
      const requestBody: MetaTagsSaveRequest = {};
      if (titleChanged && titleValid) {
        requestBody.title = { template: titleTemplate };
      }
      if (descriptionChanged) {
        requestBody.description = { template: nextDescriptionTemplate };
      }

      try {
        const response = (await firstValueFrom(
          metatagsStore.postApiMetatagsByPostId(postId, requestBody as unknown as MetaTagsPostRequestDto, {
            noCache: true,
          }),
        )) as unknown as MetaTagsApiResponse | undefined;

        const savedTitleTemplate = requestBody.title
          ? savedTemplate(response, "title", titleTemplate)
          : snippet.titleTemplate;
        const savedDescriptionTemplate = requestBody.description
          ? savedTemplate(response, "description", nextDescriptionTemplate)
          : snippet.descriptionTemplate;

        onSaved({
          title: requestBody.title
            ? resolveTemplate(savedTitleTemplate, variablesMap) || snippet.postTitle
            : snippet.title,
          titleTemplate: savedTitleTemplate,
          description: requestBody.description
            ? resolveTemplate(savedDescriptionTemplate, variablesMap)
            : snippet.description,
          descriptionTemplate: savedDescriptionTemplate,
        });
        return true;
      } catch (err) {
        setError(extractErrorMessage(err));
        setIsSaving(false);
        return false;
      }
    }, [
      isDirty,
      isSaving,
      description,
      titleChanged,
      titleValid,
      titleTemplate,
      descriptionChanged,
      postId,
      snippet,
      variablesMap,
      onSaved,
    ]);

    /** Save when there are edits (the owner then closes), otherwise just close. */
    const saveAndClose = useCallback(async () => {
      if (isSaving) {
        return;
      }
      if (!isDirty) {
        onClose();
        return;
      }
      await persist();
    }, [isDirty, isSaving, onClose, persist]);

    useImperativeHandle(ref, () => ({ saveAndClose }), [saveAndClose]);

    // Escape discards; a click anywhere outside the card saves and closes.
    useEffect(() => {
      const onKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape" && !isSaving) {
          event.stopPropagation();
          onClose();
        }
      };

      const onPointerDown = (event: MouseEvent) => {
        const target = event.target as Node | null;
        if (!target || isSaving) {
          return;
        }
        if (panelRef.current?.contains(target) || anchorRef.current?.contains(target) || isInsidePortal(target)) {
          return;
        }
        void saveAndClose();
      };

      document.addEventListener("keydown", onKeyDown);
      document.addEventListener("mousedown", onPointerDown);

      return () => {
        document.removeEventListener("keydown", onKeyDown);
        document.removeEventListener("mousedown", onPointerDown);
      };
    }, [isSaving, onClose, saveAndClose, anchorRef]);

    const handlePanelKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key !== "Enter") {
        return;
      }
      const target = event.target as HTMLElement;
      const isTextInput = target.tagName === "INPUT";
      if (isTextInput || event.metaKey || event.ctrlKey) {
        event.preventDefault();
        void saveAndClose();
      }
    };

    // "Open in editor" navigates in this tab; pending edits are saved first.
    const handleEditorLinkClick = (event: React.MouseEvent) => {
      if (!snippet.editLink || !isDirty || isSaving) {
        return;
      }
      event.preventDefault();
      void persist().then((saved) => {
        if (saved) {
          window.location.assign(snippet.editLink);
        }
      });
    };

    const panelStyle: React.CSSProperties = position
      ? { top: position.top, left: position.left, width: position.width }
      : { top: 0, left: 0, width: PANEL_WIDTH, visibility: "hidden" };

    return createPortal(
      <div
        ref={panelRef}
        className={classNames(styles.panel, position?.placement === "above" ? styles.panelAbove : styles.panelBelow)}
        style={panelStyle}
        role="dialog"
        aria-label={__("Edit SEO title and description", "beyondseo")}
        data-testid="rc-seo-quick-edit"
        onKeyDown={handlePanelKeyDown}
      >
        <span
          className={styles.arrow}
          style={{ left: position?.arrowOffset ?? DEFAULT_ARROW_OFFSET }}
          aria-hidden="true"
        />

        <div className={styles.titleEditor} data-testid="rc-quick-edit-title">
          <MultiSelectAdornmentInput
            title={__("Title", "beyondseo")}
            variableConfig={variableConfig}
            separatorConfig={separatorConfig}
            initialAdornments={initialAdornments}
            onSave={setTitleAdornments}
            value={titlePreview}
            maxChars={TITLE_MAX_LENGTH}
            defaultValue={snippet.postTitle}
          />
        </div>

        <div className={styles.field}>
          <div className={styles.fieldHeader}>
            <Text className={styles.fieldTitle} fontWeight={FontWeights.medium}>
              {__("Description", "beyondseo")}
            </Text>
          </div>
          <Textarea
            value={description}
            onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(event.target.value)}
            placeholder={__("Enter SEO meta description", "beyondseo")}
            maxLength={DESCRIPTION_MAX_LENGTH}
            counter={false}
            highlightUrl={false}
            minRows={2}
            maxRows={4}
            disabled={isSaving}
            className={styles.textarea}
            testId="rc-quick-edit-description"
          />
          <div className={styles.counterRow}>
            <span className={styles.counter} data-testid="rc-quick-edit-description-counter">
              {description.length} / {DESCRIPTION_MAX_LENGTH} {__("recommended", "beyondseo")}
            </span>
          </div>
        </div>

        <Render if={!!error}>
          <InfoBox type="danger" borderRadius={8} testId="rc-quick-edit-error" description={error || ""} />
        </Render>

        <div className={styles.footer}>
          <span onClickCapture={handleEditorLinkClick}>
            <Link href={snippet.editLink} disabled={!snippet.editLink}>
              {__("Open in editor", "beyondseo")}
            </Link>
          </span>

          <div className={styles.actions}>
            <Button
              type={ButtonTypes.secondary}
              size={ButtonSizes.small}
              onClick={onClose}
              disabled={isSaving}
              testId="rc-quick-edit-cancel"
            >
              {__("Cancel", "beyondseo")}
            </Button>
            <Button
              type={ButtonTypes.primary}
              size={ButtonSizes.small}
              onClick={() => void saveAndClose()}
              disabled={!isDirty || isSaving}
              isLoading={isSaving}
              testId="rc-quick-edit-save"
            >
              {__("Save changes", "beyondseo")}
            </Button>
          </div>
        </div>
      </div>,
      document.body,
    );
  },
);

SeoQuickEdit.displayName = "SeoQuickEdit";
