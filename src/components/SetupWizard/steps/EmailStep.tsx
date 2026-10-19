import * as React from "react";
import { useState } from "react";
import { __ } from "@wordpress/i18n";
import {
  Button,
  ButtonSizes,
  ButtonTypes,
  CheckBox,
  FontWeights,
  IconNames,
  InfoBox,
  Input,
  Render,
  Text,
  TextTypes,
} from "vanguard";
import { isValidEmail } from "@helpers/string-helpers";
import { StepLayout } from "../StepLayout";
import { EmailLead, saveEmailLead } from "../setup-wizard-api";
import shared from "../SetupWizard.module.scss";

interface EmailStepProps {
  email: string;
  optIn: boolean;
  scanFailed: boolean;
  savedLead: EmailLead | null;
  onEmailChange: (email: string) => void;
  onSaved: (lead: EmailLead) => void;
  onOptInChange: (optIn: boolean) => void;
  onBack: () => void;
  onNext: () => void;
}

export const EmailStep: React.FC<EmailStepProps> = ({
  email,
  optIn,
  scanFailed,
  savedLead,
  onEmailChange,
  onSaved,
  onOptInChange,
  onBack,
  onNext,
}) => {
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!isValidEmail(email.trim())) {
      setError(__("Enter a valid email address or skip this step.", "beyondseo"));
      return;
    }
    if (!optIn) {
      setError(__("Select the consent checkbox or skip this step.", "beyondseo"));
      return;
    }
    setError(null);
    setIsSaving(true);
    try {
      onSaved(await saveEmailLead(email.trim(), optIn));
      onNext();
    } catch (saveError: any) {
      setError(saveError?.message || __("Your email address could not be saved. Please try again.", "beyondseo"));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <StepLayout
      footerStart={
        <Button
          type={ButtonTypes.secondary}
          size={ButtonSizes.medium}
          iconLeft={IconNames.arrowLeft}
          onClick={onBack}
          disabled={isSaving}
        >
          {__("Back to site check", "beyondseo")}
        </Button>
      }
      footerEnd={
        <>
          <Button type={ButtonTypes.default} size={ButtonSizes.medium} onClick={onNext} disabled={isSaving}>
            {__("Skip", "beyondseo")}
          </Button>
          <Button
            type={ButtonTypes.primary}
            size={ButtonSizes.medium}
            onClick={handleSave}
            isLoading={isSaving}
            disabled={isSaving}
          >
            {__("Save and continue", "beyondseo")}
          </Button>
        </>
      }
    >
      <div className={shared.intro}>
        <Text type={TextTypes.heading2} fontWeight={FontWeights.bold}>
          {scanFailed
            ? __("Get general SEO tips by email", "beyondseo")
            : __("Get SEO recommendations by email", "beyondseo")}
        </Text>
        <Text type={TextTypes.text} className={shared.description}>
          {scanFailed
            ? __(
                "The site check did not finish, so we cannot send page-specific findings yet. You can still receive general SEO tips, or skip this step.",
                "beyondseo",
              )
            : __(
                "Receive follow-up ideas after reviewing your site. This step is optional and does not create a rankingCoach account.",
                "beyondseo",
              )}
        </Text>
      </div>

      <Render if={!!error}>
        <InfoBox type="danger" borderRadius={8} description={error || ""} />
      </Render>

      <Render if={!!savedLead && savedLead.email === email.trim() && optIn}>
        <InfoBox
          type="info"
          borderRadius={8}
          description={__("This address is saved for SEO recommendations. Save again to update it.", "beyondseo")}
        />
      </Render>

      <div className={shared.card}>
        <Input
          label={__("Email address", "beyondseo")}
          labelType="static"
          type="email"
          value={email}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => onEmailChange(event.target.value)}
          placeholder="you@example.com"
          testId="rc-wizard-email"
        />
        <CheckBox
          checked={optIn}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => onOptInChange(event.target.checked)}
          label={__(
            "Email me SEO recommendations and occasional BeyondSEO / rankingCoach product updates. I can unsubscribe at any time.",
            "beyondseo",
          )}
        />
      </div>

      <Text type={TextTypes.textHelp} className={shared.fine}>
        {__("Optional and separate from account creation.", "beyondseo")}
      </Text>
    </StepLayout>
  );
};
