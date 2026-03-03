// hooks/use-locale-loader.ts
import { useEffect, useState } from 'react';
import { setLocaleData } from '@wordpress/i18n';
import { rcWindow } from "@stores/window.store";

// Use import.meta.glob to pre-bundle all translation JSON files at build time
// This allows Vite to know which files might be dynamically imported
const translationModules = import.meta.glob('../../../languages/json/beyondseo-*.json');

export const useLocaleLoader = () => {
  const [isLocaleReady, setIsLocaleReady] = useState(false);

  useEffect(() => {
    const locale = rcWindow?.rankingCoachReactData?.locale || 'en_US';
    const langCode = locale.replace('-', '_'); // fr-FR -> fr_FR

    // Construct the path that matches the glob pattern
    const translationPath = `../../../languages/json/beyondseo-${langCode}.json`;

    // Check if the translation file exists in the pre-bundled modules
    const loadModule = translationModules[translationPath];

    if (loadModule) {
      loadModule()
        .then((jsonModule: unknown) => {
          const moduleWithDefault = jsonModule as { default: Record<string, unknown> };
          setLocaleData(moduleWithDefault.default, 'beyondseo');
          setIsLocaleReady(true);
        })
        .catch((err) => {
          console.warn(`Failed to load translation JSON for ${langCode}`, err);
          setIsLocaleReady(true); // still let app continue
        });
    } else {
      console.warn(`Translation JSON for ${langCode} not found. Available translations:`, Object.keys(translationModules));
      setIsLocaleReady(true); // still let app continue with default translations
    }
  }, []);

  return isLocaleReady;
};
