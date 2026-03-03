import { __ } from "@wordpress/i18n";
import * as React from "react";
import { SyntheticEvent, useState } from "react";
import styles from "./FeatureSwitch.module.scss";
import { classNames, ComponentContainer, ModalResponse, ModalService, Render, Switch, Text } from "vanguard";
import { useAppDispatch } from "@hooks/use-app-dispatch";
import { useSelector } from "react-redux";
import { RootState } from "@src/main.store";
import { AppSlice } from "@src/App.slice";
import { UpgradePackageFeature, UpgradePackageModal } from "@components/Modals/UpgradePackageModal/UpgradePackageModal";

export type FeatureSwitchProps = {
  className?: string;
  onSwitchChange?: (event: SyntheticEvent, checked: boolean) => void;
  proVersion: boolean;
};

export const FeatureSwitch = (props: FeatureSwitchProps) => {
  const { proVersion } = useSelector((state: RootState) => state.app);
  const { proVersion: proVersionProp, onSwitchChange } = props;
  const pro = (proVersion || proVersionProp) ?? false;

  const [switchOpen, setSwitchOpen] = useState(false);
  const dispatch = useAppDispatch();
  const { setAppLoadedModalId } = AppSlice;
  const featuresList: UpgradePackageFeature[] = [
    {
      title: __("From 1 to many", "beyondseo"),
      description: __("Track more keywords than you can right now", "beyondseo"),
    },
    {
      title: __("Meta generator", "beyondseo"),
      description: __("Create meta descriptions and titles automatically", "beyondseo"),
    },
    {
      title: __("Automatic canonicals", "beyondseo"),
      description: __("Avoid duplicate content with smart URL settings", "beyondseo"),
    },
    {
      title: __("Image Alt-text generator", "beyondseo"),
      description: __("Automate alt text and titles for images", "beyondseo"),
    },
    {
      title: __("AI-powered social content", "beyondseo"),
      description: __("Generate social media titles and metadata instantly", "beyondseo"),
    },
    {
      title: __("Page content", "beyondseo"),
      description: __("Auto-integrate keywords into your page content", "beyondseo"),
    },
  ];

  const openModal = () => {
    const modalId = ModalService.open(
      <UpgradePackageModal
        close={function (r: ModalResponse<null>): void {
          ModalService.closeEv(modalId);
          dispatch(setAppLoadedModalId(""));
        }}
        features={featuresList}
      />,
    );
    dispatch(setAppLoadedModalId(modalId));
  };

  const handleSwitchChange = (event: SyntheticEvent) => {
    const checked = (event.currentTarget as HTMLInputElement).checked;

    if (!pro && checked) {
      openModal();
      return;
    }

    setSwitchOpen(checked);
    onSwitchChange && onSwitchChange(event, checked);
  };

  return (
    <ComponentContainer className={classNames(styles.container, pro ? "" : styles.background)}>
      <Switch
        className={classNames(pro ? styles.switchPro : styles.switch)}
        value={switchOpen}
        size={"small"}
        labelPos={"left"}
        onChange={handleSwitchChange}
        testId={`seo-title-autogenerate-small-switch`}
      >
        {"Autogenerate"}
      </Switch>
      <Render if={!pro}>
        <Text className={classNames(styles.textPro)}>{__("PRO FEATURE", "beyondseo")}</Text>
      </Render>
    </ComponentContainer>
  );
};
