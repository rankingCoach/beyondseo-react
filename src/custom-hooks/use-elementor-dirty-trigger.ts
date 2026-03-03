import { useCallback, useEffect, useMemo, useRef } from 'react';

declare global {
  interface Window {
    elementor?: {
      settings?: {
        page?: { setFlagEditorChange?: (flag: boolean) => void };
        editor?: { setFlagEditorChange?: (flag: boolean) => void };
      };
      saver?: { setFlagSaveRequired?: (flag: boolean) => void };
    };
    $e?: {
      internal?: (command: string, args?: any) => void;
    };
    rankingCoachMarkElementorDirty?: () => void;
  }
}

interface UseElementorDirtyTriggerReturn {
  markDirty: () => void;
  isElementorContext: boolean;
  canMarkDirty: boolean;
}

export function useElementorDirtyTrigger(
  deps?: React.DependencyList
): UseElementorDirtyTriggerReturn {
  /**
   * Detect Elementor editor presence
   */
  const isElementorContext = useMemo(() => {
    return (
      typeof window !== 'undefined' &&
      (typeof window.elementor !== 'undefined' ||
        typeof window.$e !== 'undefined')
    );
  }, []);

  /**
   * Determine whether we can safely mark dirty
   */
  const canMarkDirty = useMemo(() => {
    if (!isElementorContext) return false;
    const e = window.elementor;
    return (
      !!window.$e ||
      !!e?.settings?.page?.setFlagEditorChange ||
      !!e?.saver?.setFlagSaveRequired ||
      !!e?.settings?.editor?.setFlagEditorChange
    );
  }, [isElementorContext]);

  /**
   * Memoized function to flag unsaved changes
   */
  const markDirty = useCallback(() => {
    if (!isElementorContext) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('[useElementorDirtyTrigger] Not inside Elementor editor.');
      }
      return;
    }

    try {
      // Prefer global helper if present
      if (typeof window.rankingCoachMarkElementorDirty === 'function') {
        window.rankingCoachMarkElementorDirty();
        return;
      }

      // Modern (Elementor ≥3.6)
      if (window.$e?.internal) {
        window.$e.internal('document/save/set-is-modified', { status: true });
        return;
      }

      // Legacy fallbacks
      const e = window.elementor;
      let touched = false;

      if (e?.settings?.page?.setFlagEditorChange) {
        e.settings.page.setFlagEditorChange(true);
        touched = true;
      }
      if (e?.saver?.setFlagSaveRequired) {
        e.saver.setFlagSaveRequired(true);
        touched = true;
      }
      if (e?.settings?.editor?.setFlagEditorChange) {
        e.settings.editor.setFlagEditorChange(true);
        touched = true;
      }

      if (!touched && process.env.NODE_ENV === 'development') {
        console.warn(
          '[useElementorDirtyTrigger] No valid Elementor API methods available.'
        );
      }
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[useElementorDirtyTrigger] Failed to mark dirty:', err);
      }
    }
  }, [isElementorContext]);

  /**
   * Track initial values to prevent marking dirty on data load
   */
  const initialValues = useRef<any>(null);
  const hasInitialized = useRef(false);

  /**
   * Auto-trigger on dependency change
   */
  useEffect(() => {
    // On first run, capture the initial values (even if undefined)
    if (!hasInitialized.current) {
      initialValues.current = deps ? JSON.stringify(deps) : null;
      hasInitialized.current = true;
      return;
    }
    
    // Only mark dirty if dependencies have changed from initial values
    // This prevents marking dirty when data is first loaded from server
    const currentValues = deps ? JSON.stringify(deps) : null;
    const hasChanged = initialValues.current !== currentValues;
    
    if (hasChanged && deps && canMarkDirty) {
      markDirty();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps ? [...deps, canMarkDirty] : []);

  return { markDirty, isElementorContext, canMarkDirty };
}