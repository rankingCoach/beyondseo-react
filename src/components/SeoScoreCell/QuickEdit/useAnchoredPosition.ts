import { RefObject, useCallback, useLayoutEffect, useState } from "react";

export type AnchoredPlacement = "below" | "above";

export interface AnchoredPosition {
  /** Document coordinates (the panel is absolutely positioned in `document.body`). */
  top: number;
  left: number;
  width: number;
  placement: AnchoredPlacement;
  /** Horizontal offset of the caret from the panel's left edge. */
  arrowOffset: number;
}

const VIEWPORT_GUTTER = 16;
const ANCHOR_GAP = 12;
const ARROW_INSET = 28;

/**
 * Position a floating panel under (or, when the viewport runs out of room,
 * above) an anchor element, clamped to the viewport width. Re-measures when the
 * window resizes and when the panel's own size changes.
 */
export const useAnchoredPosition = (
  anchorRef: RefObject<HTMLElement | null>,
  panelRef: RefObject<HTMLElement | null>,
  open: boolean,
  preferredWidth: number,
): AnchoredPosition | null => {
  const [position, setPosition] = useState<AnchoredPosition | null>(null);

  const measure = useCallback(() => {
    const anchor = anchorRef.current;
    if (!anchor) {
      return;
    }

    const rect = anchor.getBoundingClientRect();
    const viewportWidth = document.documentElement.clientWidth;
    const viewportHeight = window.innerHeight;
    const width = Math.min(preferredWidth, viewportWidth - VIEWPORT_GUTTER * 2);
    const panelHeight = panelRef.current?.offsetHeight ?? 0;

    const unclampedLeft = rect.left;
    const left = Math.max(VIEWPORT_GUTTER, Math.min(unclampedLeft, viewportWidth - width - VIEWPORT_GUTTER));

    const spaceBelow = viewportHeight - rect.bottom;
    const spaceAbove = rect.top;
    const placement: AnchoredPlacement =
      panelHeight > 0 && spaceBelow < panelHeight + ANCHOR_GAP && spaceAbove > spaceBelow ? "above" : "below";

    const top =
      placement === "below"
        ? rect.bottom + window.scrollY + ANCHOR_GAP
        : rect.top + window.scrollY - panelHeight - ANCHOR_GAP;

    const arrowOffset = Math.max(ARROW_INSET, Math.min(unclampedLeft - left + ARROW_INSET, width - ARROW_INSET));

    setPosition({ top, left: left + window.scrollX, width, placement, arrowOffset });
  }, [anchorRef, panelRef, preferredWidth]);

  useLayoutEffect(() => {
    if (!open) {
      setPosition(null);
      return;
    }

    measure();

    window.addEventListener("resize", measure);

    let observer: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined" && panelRef.current) {
      observer = new ResizeObserver(() => measure());
      observer.observe(panelRef.current);
    }

    return () => {
      window.removeEventListener("resize", measure);
      observer?.disconnect();
    };
  }, [open, measure, panelRef]);

  return position;
};
