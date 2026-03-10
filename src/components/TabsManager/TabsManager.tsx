import * as React from "react";
import { classNames, ComponentContainer, Tabs } from "vanguard";
import { GeneralTab } from "@components/TabsManager/Tabs/GeneralTab/GeneralTab";
import { OptimisationTab } from "@components/TabsManager/Tabs/OptimisationTab/OptimisationTab";
import { SchemaTab } from "@components/TabsManager/Tabs/SchemaTab/SchemaTab";
import { SocialTab } from "./Tabs/SocialTab/SocialTab";
import { RedirectsTab } from "./Tabs/RedirectsTab/RedirectsTab";
import { AdvancedTab } from "./Tabs/AdvancedTab/AdvancedTab";
import { ScoreRecalculationProvider } from "@contexts/ScoreRecalculationContext";
// import {LinkAssistantTab} from './Tabs/LinkAssistantTab/LinkAssistantTab';
import { LinkAssistantTab } from "@components/TabsManager/Tabs/LinkAssistantTab/LinkAssistantTab";
import { __ } from "@wordpress/i18n";
import styles from "./TabsManager.module.scss";

export const TabsManager = (props: any) => {

  const [recalculationStart, setRecalculationStart] = React.useState(false);

  const handleRecalculationStart = React.useCallback(() => {
    setRecalculationStart(true);
  }, []);

  const handleRecalculationComplete = React.useCallback(() => {
    setRecalculationStart(false);
  }, []);

  return (
    <ScoreRecalculationProvider
      onRecalculationStart={handleRecalculationStart}
      onRecalculationComplete={handleRecalculationComplete}
    >
      <ComponentContainer
        testId={"tabs-manager-container"}
        className={classNames("tabs-manager-container", styles.tabs)}
      >
        <Tabs
          mode={"small"}
          tabConfig={{ theme: 'underline' }}
          tabs={[
            {
              label: __("General", "beyondseo"),
              //@ts-ignore
              component: <GeneralTab />,
              hasBorderBottom: true,
              showBackgroundColor: false,
              simple: true,
            },
            {
              label: __("Optimisation", "beyondseo"),
              //@ts-ignore
              component: <OptimisationTab recalculationStart={recalculationStart} />,
              hasBorderBottom: true,
              showBackgroundColor: false,
              simple: true,
            },
            {
              label: __("Social", "beyondseo"),
              //@ts-ignore
              component: <SocialTab />,
              hasBorderBottom: true,
              showBackgroundColor: false,
              simple: true,
            },
            {
              label: __("Schema", "beyondseo"),
              //@ts-ignore
              component: <SchemaTab />,
              hasBorderBottom: true,
              showBackgroundColor: false,
              simple: true,
            },
            {
              label: __("Link assistant", "beyondseo"),
              //@ts-ignore
              component: <LinkAssistantTab />,
              hasBorderBottom: true,
              showBackgroundColor: false,
              simple: true,
            },
            {
              label: __("Redirects", "beyondseo"),
              //@ts-ignore
              component: <RedirectsTab />,
              hasBorderBottom: true,
              showBackgroundColor: false,
              simple: true,
            },
            {
              label: __("Advanced", "beyondseo"),
              //@ts-ignore
              component: <AdvancedTab />,
              hasBorderBottom: true,
              showBackgroundColor: false,
              simple: true,
            },
          ]}
        />
      </ComponentContainer>
    </ScoreRecalculationProvider>
  );
};
