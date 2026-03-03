import * as React from "react";
import { ComponentContainer, Skeleton, VanguardStyle } from "vanguard";
import { classNames } from "vanguard";
import tabStyles from "../Tabs.module.scss";

export const SchemaTabPlaceholder = () => {
  return (
    <div className={classNames(tabStyles.tabContent, "optimisation-tab-container")}>
      <ComponentContainer className={classNames(VanguardStyle.dFlex, VanguardStyle.gap8, VanguardStyle.flexWrap)}>
        <ComponentContainer className={VanguardStyle.flexGrow4}>
          <Skeleton width={100} height={24} />
          <Skeleton width={300} height={40} className={VanguardStyle.mt2} />

          <ComponentContainer className={VanguardStyle.mt4}>
            <Skeleton width={150} height={40} />
          </ComponentContainer>

          <ComponentContainer className={VanguardStyle.mt4}>
            <Skeleton width={200} height={20} />
          </ComponentContainer>
        </ComponentContainer>

        <ComponentContainer className={VanguardStyle.flexGrow1}>
          <Skeleton width={300} height={158} />
        </ComponentContainer>
      </ComponentContainer>
    </div>
  );
};
