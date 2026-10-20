import * as React from "react";
import { classNames, Icon, IconNames, IconSize } from "vanguard";
import { __, sprintf } from "@wordpress/i18n";
import styles from "./SetupWizard.module.scss";

export interface WizardStepDefinition {
  id: string;
  label: string;
}

interface WizardStepperProps {
  steps: WizardStepDefinition[];
  activeIndex: number;
}

export const WizardStepper: React.FC<WizardStepperProps> = ({ steps, activeIndex }) => (
  <ol className={styles.stepper} aria-label={__("Setup steps", "beyondseo")}>
    {steps.map((step, index) => {
      const isActive = index === activeIndex;
      const isDone = index < activeIndex;

      return (
        <li
          key={step.id}
          className={classNames(
            styles.step,
            isActive ? styles.stepActive : undefined,
            isDone ? styles.stepDone : undefined,
          )}
          aria-current={isActive ? "step" : undefined}
        >
          <span className={styles.stepNumber} aria-hidden="true">
            {isDone ? (
              <Icon type={IconSize.small} color="var(--s900)">
                {IconNames.check}
              </Icon>
            ) : (
              index + 1
            )}
          </span>
          <span className={styles.stepLabel}>
            {/* translators: 1: step number, 2: total number of steps, 3: step name */}
            {isActive
              ? sprintf(__("Step %1$d of %2$d · %3$s", "beyondseo"), index + 1, steps.length, step.label)
              : step.label}
          </span>
        </li>
      );
    })}
  </ol>
);
