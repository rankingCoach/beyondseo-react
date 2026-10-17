import * as React from "react";
import { useState } from "react";
import { __, sprintf } from "@wordpress/i18n";
import {
  Button,
  ButtonSizes,
  ButtonTypes,
  classNames,
  FontWeights,
  IconNames,
  InfoBox,
  Render,
  Text,
  TextTypes,
} from "vanguard";
import { StepLayout } from "../StepLayout";
import { ImportResult, ImportSource, runImport } from "../setup-wizard-api";
import shared from "../SetupWizard.module.scss";

interface ImportStepProps {
  sources: ImportSource[];
  result: ImportResult | null;
  onImported: (result: ImportResult) => void;
  onBack: () => void;
  onNext: () => void;
}

export const ImportStep: React.FC<ImportStepProps> = ({ sources, result, onImported, onBack, onNext }) => {
  const [selected, setSelected] = useState<ImportSource["source"]>(
    (sources.find((source) => source.active) || sources[0])?.source || "yoast",
  );
  const [isImporting, setIsImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImport = async () => {
    setIsImporting(true);
    setError(null);
    try {
      onImported(await runImport(selected));
    } catch (importError: any) {
      setError(
        importError?.message || __("SEO import failed. Some data may have been imported; please retry.", "beyondseo"),
      );
    } finally {
      setIsImporting(false);
    }
  };

  const summary = result
    ? sprintf(
        /* translators: 1: number of imported settings, 2: number of imported page entries, 3: number of skipped entries */
        __(
          "Imported %1$d settings and %2$d page entries. %3$d entries were already set in BeyondSEO or could not be converted.",
          "beyondseo",
        ),
        result.settings,
        result.postMeta,
        result.skipped,
      )
    : "";

  return (
    <StepLayout
      footerStart={
        <Button
          type={ButtonTypes.secondary}
          size={ButtonSizes.medium}
          iconLeft={IconNames.arrowLeft}
          onClick={onBack}
          disabled={isImporting}
        >
          {__("Back", "beyondseo")}
        </Button>
      }
      footerEnd={
        <>
          <Render if={!result}>
            <Button type={ButtonTypes.default} size={ButtonSizes.medium} onClick={onNext} disabled={isImporting}>
              {__("Continue without import", "beyondseo")}
            </Button>
          </Render>
          {result ? (
            <Button type={ButtonTypes.primary} size={ButtonSizes.medium} onClick={onNext}>
              {__("Continue", "beyondseo")}
            </Button>
          ) : (
            <Button
              type={ButtonTypes.primary}
              size={ButtonSizes.medium}
              onClick={handleImport}
              isLoading={isImporting}
              disabled={isImporting}
            >
              {__("Import", "beyondseo")}
            </Button>
          )}
        </>
      }
    >
      <div className={shared.intro}>
        <Text type={TextTypes.heading2} fontWeight={FontWeights.bold}>
          {__("Keep your existing SEO work", "beyondseo")}
        </Text>
        <Text type={TextTypes.text} className={shared.description}>
          {__(
            "Another SEO plugin was found on this site. BeyondSEO can bring over its SEO titles, descriptions, keywords and supported site settings. Values you already saved in BeyondSEO are kept, and the other plugin’s data stays untouched.",
            "beyondseo",
          )}
        </Text>
      </div>

      <Render if={!!error}>
        <InfoBox type="danger" borderRadius={8} description={error || ""} />
      </Render>

      <Render if={!!result}>
        <InfoBox type="info" borderRadius={8} title={__("Import finished", "beyondseo")} description={summary} />
      </Render>

      <Render if={!result}>
        <div role="radiogroup" aria-label={__("Plugin to import from", "beyondseo")}>
          {sources.map((source) => (
            <button
              key={source.source}
              type="button"
              role="radio"
              aria-checked={selected === source.source}
              className={classNames(shared.optionCard, selected === source.source && shared.optionCardSelected)}
              onClick={() => setSelected(source.source)}
              disabled={isImporting}
            >
              <div className={shared.optionBody}>
                <Text type={TextTypes.text} fontWeight={FontWeights.bold}>
                  {source.name}
                </Text>
                <Text type={TextTypes.textHelp} className={shared.fine}>
                  {source.active ? __("Active on this site", "beyondseo") : __("Installed but not active", "beyondseo")}
                </Text>
              </div>
            </button>
          ))}
        </div>
      </Render>

      <Text type={TextTypes.textHelp} className={shared.fine}>
        {__(
          "Titles and descriptions that use unsupported template variables are skipped. You can review every page afterwards.",
          "beyondseo",
        )}
      </Text>
    </StepLayout>
  );
};
