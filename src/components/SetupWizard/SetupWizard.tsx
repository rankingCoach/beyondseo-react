import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import { __ } from "@wordpress/i18n";
import beyondSEOLogo from "@assets/beyondSEO-logo.svg";
import { AdminPage, getAdminPageUrl } from "@helpers/internal-links";
import styles from "./SetupWizard.module.scss";
import { WizardStepDefinition, WizardStepper } from "./WizardStepper";
import { SetupWizardPlaceholder } from "./SetupWizardPlaceholder";
import { EssentialsStep } from "./steps/EssentialsStep";
import { ImportStep } from "./steps/ImportStep";
import { ScanSnapshot, ScanStep } from "./steps/ScanStep";
import { EmailStep } from "./steps/EmailStep";
import { AccountStep } from "./steps/AccountStep";
import {
  getAdminEmail,
  getImportSources,
  getSitemapSettings,
  getWpSiteSettings,
  ImportResult,
  ImportSource,
  saveWizardState,
  SitemapSettings,
  WizardState,
  WpSiteSettings,
} from "./setup-wizard-api";

type WizardStepId = "essentials" | "import" | "scan" | "email" | "account";

interface PersistedState {
  step: WizardStepId;
  scan: ScanSnapshot | null;
  importResult: ImportResult | null;
  email: string;
  emailOptIn: boolean;
}

const STORAGE_KEY = "rankingcoach_setup_wizard";
const CONTAINER_ID = "setupWizard-rankingcoach-page";

const readPersisted = (): Partial<PersistedState> => {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);

    return raw ? (JSON.parse(raw) as Partial<PersistedState>) : {};
  } catch {
    return {};
  }
};

const writePersisted = (state: PersistedState): void => {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // session storage unavailable: the wizard still works within the page
  }
};

const clearPersisted = (): void => {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // nothing to clear
  }
};

export const SetupWizard: React.FC = () => {
  const persisted = useMemo(readPersisted, []);
  const [isLoading, setIsLoading] = useState(true);
  const [site, setSite] = useState<WpSiteSettings | null>(null);
  const [sitemap, setSitemap] = useState<SitemapSettings | null>(null);
  const [sources, setSources] = useState<ImportSource[]>([]);
  const [step, setStep] = useState<WizardStepId>(persisted.step || "essentials");
  const [scan, setScan] = useState<ScanSnapshot | null>(persisted.scan || null);
  const [importResult, setImportResult] = useState<ImportResult | null>(persisted.importResult || null);
  const [email, setEmail] = useState(persisted.email ?? getAdminEmail());
  const [emailOptIn, setEmailOptIn] = useState(!!persisted.emailOptIn);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    let cancelled = false;

    // Each source is optional: a failed request only hides what depends on it.
    Promise.allSettled([getWpSiteSettings(), getSitemapSettings(), getImportSources()]).then(
      ([siteResult, sitemapResult, sourcesResult]) => {
        if (cancelled) {
          return;
        }
        if (siteResult.status === "fulfilled") {
          setSite(siteResult.value);
        }
        if (sitemapResult.status === "fulfilled") {
          setSitemap(sitemapResult.value);
        }
        if (sourcesResult.status === "fulfilled") {
          setSources(sourcesResult.value);
        }
        setIsLoading(false);
      },
    );

    return () => {
      cancelled = true;
    };
  }, []);

  const steps = useMemo<WizardStepDefinition[]>(
    () => [
      { id: "essentials", label: __("Essentials", "beyondseo") },
      ...(sources.length > 0 || importResult ? [{ id: "import", label: __("Import", "beyondseo") }] : []),
      { id: "scan", label: __("Site check", "beyondseo") },
      { id: "email", label: __("Email tips", "beyondseo") },
      { id: "account", label: __("rankingCoach account", "beyondseo") },
    ],
    [sources, importResult],
  );

  const activeIndex = Math.max(
    0,
    steps.findIndex((definition) => definition.id === step),
  );

  useEffect(() => {
    writePersisted({ step, scan, importResult, email, emailOptIn });
  }, [step, scan, importResult, email, emailOptIn]);

  useEffect(() => {
    // A persisted "import" step is not reachable any more once no source is installed.
    if (!isLoading && !steps.some((definition) => definition.id === step)) {
      setStep("scan");
    }
  }, [isLoading, steps, step]);

  const goTo = (index: number) => {
    const target = steps[Math.min(Math.max(index, 0), steps.length - 1)];
    setStep(target.id as WizardStepId);
    document.getElementById(CONTAINER_ID)?.scrollTo({ top: 0 });
  };

  const next = () => goTo(activeIndex + 1);
  const back = () => goTo(activeIndex - 1);

  const leave = async (state: WizardState, url: string) => {
    setIsLeaving(true);
    try {
      await saveWizardState(state);
    } catch {
      // the redirect is one-shot anyway; losing the flag only affects re-activation
    }
    clearPersisted();
    window.location.href = url;
  };

  const settingsUrl = getAdminPageUrl(AdminPage.GeneralSettings);
  const exit = () => leave({ completed: false, dismissed: true }, settingsUrl);
  const finish = () => leave({ completed: true, dismissed: false }, settingsUrl);
  const connect = (url: string) => leave({ completed: true, dismissed: false }, url);

  const renderStep = () => {
    switch (step) {
      case "import":
        return (
          <ImportStep
            sources={sources}
            result={importResult}
            onImported={setImportResult}
            onBack={back}
            onNext={next}
          />
        );
      case "scan":
        return <ScanStep snapshot={scan} onSnapshot={setScan} onBack={back} onNext={next} />;
      case "email":
        return (
          <EmailStep
            email={email}
            optIn={emailOptIn}
            scanFailed={scan?.outcome === "error"}
            onEmailChange={setEmail}
            onOptInChange={setEmailOptIn}
            onBack={back}
            onNext={next}
          />
        );
      case "account":
        return <AccountStep onBack={back} onFinish={finish} onConnect={connect} isFinishing={isLeaving} />;
      default:
        return (
          <EssentialsStep
            site={site}
            sitemap={sitemap}
            onSitemapSaved={setSitemap}
            onExit={exit}
            onNext={next}
            isLeaving={isLeaving}
          />
        );
    }
  };

  return (
    <div className={styles.wizard} data-testid="rc-setup-wizard">
      <div className={styles.header}>
        <div className={styles.logo}>
          <img src={beyondSEOLogo} alt="BeyondSEO" />
        </div>
        {!isLoading && <WizardStepper steps={steps} activeIndex={activeIndex} />}
      </div>
      <div className={styles.divider} />
      {isLoading ? <SetupWizardPlaceholder /> : renderStep()}
    </div>
  );
};
