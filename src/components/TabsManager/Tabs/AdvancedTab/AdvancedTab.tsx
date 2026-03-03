import * as React from "react";
import { useEffect, useState } from "react";
import {
  classNames,
  ComponentContainer,
  FontWeights,
  Form,
  Input,
  Switch,
  Text,
  useFormConfig,
  VanguardStyle,
} from "vanguard";
import { useAppDispatch } from "@hooks/use-app-dispatch";
import { getPathId } from "@helpers/get-path-id";
import { useScoreRecalculation } from "@contexts/ScoreRecalculationContext";
import { AppSlice } from "@src/App.slice";
import { RootState } from "@src/main.store";
import { useSelector } from "react-redux";
import styles from "./AdvancedTab.module.scss";
import { __ } from "@wordpress/i18n";
import tabStyles from "../Tabs.module.scss";
import { AdvancedSettingsStore } from "@stores/swagger/api/AdvancedSettingsStore";
import { AdvancedTabPlaceholder } from "./AdvancedTabPlaceholder";

export interface AdvancedTabProps {
  proVersion?: boolean;
}

export const advancedTabProps: AdvancedTabProps = {
  proVersion: false,
};

export const AdvancedTab = ({ proVersion = false }: AdvancedTabProps) => {
  const dispatch = useAppDispatch();
  const currentPostId = getPathId();
  const { triggerRecalculation } = useScoreRecalculation();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { noIndexForPage, excludeSitemapForPage, canonicalUrl, disableAutoLinks, viewportForPage } = useSelector((state: RootState) => state.app);
  const { currentPost, isCurrentPostLoaded } = useSelector((state: RootState) => state.post);
  const { setNoIndexForPage, setExcludeSitemapForPage, setCanonicalUrl, setDisableAutoLinks, setViewportForPage } = AppSlice;

  const { formConfig } = useFormConfig({
    slice: AppSlice as any,
    reducer: (state: RootState) => state.app,
    inputs: {
      canonicalUrl: {
        validation: {
          urlNotAllowed: false,
          maxLength: 250,
        },
      },
      noIndexForPage: {},
      excludeSitemapForPage: {},
      disableAutoLinks: {},
    },
  });

  useEffect(() => {
    if (isCurrentPostLoaded && currentPost) {
      if (!canonicalUrl) dispatch(setCanonicalUrl(currentPost?.link));
    }
  }, [isCurrentPostLoaded]);

  // Listen for global score recalculation events for logging
  useEffect(() => {
    const handleScoreRecalculated = (event: CustomEvent<{ timestamp: number; apiResponse?: any; error?: any }>) => {
      const { error } = event.detail;
      if (error) {
      } else {
      }
    };

    document.addEventListener("rankingcoach-score-recalculated", handleScoreRecalculated as EventListener);

    return () => {
      document.removeEventListener("rankingcoach-score-recalculated", handleScoreRecalculated as EventListener);
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const advancedSettingsData = await dispatch(
          AdvancedSettingsStore.getApiAdvancedSettingsByPostIdThunk({
            postId: getPathId(),
            queryParams: { noCache: true },
          }),
        ).unwrap();

        if (advancedSettingsData?.canonicalUrl) {
          dispatch(setCanonicalUrl(advancedSettingsData.canonicalUrl));
        }
        if (advancedSettingsData?.noindexForPage !== undefined) {
          dispatch(setNoIndexForPage(advancedSettingsData.noindexForPage));
        }
        if (advancedSettingsData?.excludeSitemapForPage !== undefined) {
          dispatch(setExcludeSitemapForPage(advancedSettingsData.excludeSitemapForPage));
        }
        if (advancedSettingsData?.disableAutoLinks !== undefined) {
          dispatch(setDisableAutoLinks(advancedSettingsData.disableAutoLinks));
        }
        if (advancedSettingsData?.viewportForPage !== undefined) {
          dispatch(setViewportForPage(advancedSettingsData.viewportForPage));
        }
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [dispatch, currentPostId]);

  const handleCanonicalUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setCanonicalUrl(e.target.value));
  };

  const handleSaveCanonicalUrlCallback = async () => {
    // Here you would save the advanced settings info to your API
    await dispatch(
      AdvancedSettingsStore.postApiAdvancedSettingsByPostIdThunk({
        postId: currentPostId,
        requestBody: {
          canonicalUrl: canonicalUrl,
          noindexForPage: noIndexForPage,
          excludeSitemapForPage: excludeSitemapForPage,
          disableAutoLinks: disableAutoLinks,
          viewportForPage: viewportForPage
        },
        queryParams: { noCache: true },
      }),
    );

    // Trigger recalculation if needed
    triggerRecalculation(false);
  };

  const handleSaveNoIndexCallback = async () => {
    try {
      setIsSubmitting(true);
      await dispatch(
        AdvancedSettingsStore.postApiAdvancedSettingsByPostIdThunk({
          postId: currentPostId,
          requestBody: {
            canonicalUrl: canonicalUrl,
            noindexForPage: !noIndexForPage,
            excludeSitemapForPage: excludeSitemapForPage,
            disableAutoLinks: disableAutoLinks,
            viewportForPage: viewportForPage,
          },
          queryParams: { noCache: true },
        }),
      );
      dispatch(setNoIndexForPage(!noIndexForPage));
      triggerRecalculation(false);
    } catch (error) {
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDisableAutoLinksCallback = async () => {
    try {
      setIsSubmitting(true);
      await dispatch(
        AdvancedSettingsStore.postApiAdvancedSettingsByPostIdThunk({
          postId: currentPostId,
          requestBody: {
            canonicalUrl: canonicalUrl,
            noindexForPage: noIndexForPage,
            excludeSitemapForPage: excludeSitemapForPage,
            disableAutoLinks: !disableAutoLinks,
            viewportForPage: viewportForPage,
          },
          queryParams: { noCache: true },
        }),
      );
      dispatch(setDisableAutoLinks(!disableAutoLinks));
      triggerRecalculation(false);
    } catch (error) {
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleSaveExcludeSitemapCallback = async () => {
    try {
      setIsSubmitting(true);
      await dispatch(
        AdvancedSettingsStore.postApiAdvancedSettingsByPostIdThunk({
          postId: currentPostId,
          requestBody: {
            canonicalUrl: canonicalUrl,
            noindexForPage: noIndexForPage,
            excludeSitemapForPage: !excludeSitemapForPage,
            disableAutoLinks: disableAutoLinks,
            viewportForPage: viewportForPage,
          },
          queryParams: { noCache: true },
        }),
      );
      dispatch(setExcludeSitemapForPage(!excludeSitemapForPage));
      triggerRecalculation(false);
    } catch (error) {
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveViewportCallback = async () => {
    try {
      setIsSubmitting(true);
      await dispatch(
        AdvancedSettingsStore.postApiAdvancedSettingsByPostIdThunk({
          postId: currentPostId,
          requestBody: {
            canonicalUrl: canonicalUrl,
            noindexForPage: noIndexForPage,
            excludeSitemapForPage: excludeSitemapForPage,
            disableAutoLinks: disableAutoLinks,
            viewportForPage: !viewportForPage,
          },
          queryParams: { noCache: true },
        }),
      );
      dispatch(setViewportForPage(!viewportForPage));
      triggerRecalculation(false);
    } catch (error) {
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={classNames(styles.advancedTabContainer, tabStyles.tabContent)}>
      <ComponentContainer>
        <Form
          config={formConfig}
          onChange={() => {
          }}
          className={styles.advancedTabContainerForm}
        >
          <div className={VanguardStyle.mb0}>
            <Switch
              value={noIndexForPage}
              labelPos="left"
              onChange={handleSaveNoIndexCallback}
              disabled={isSubmitting}
              testId={`advanced-settings-switch`}
              className={styles.advancedTabRobotsSwitch}
            >
              <Text className={styles.advancedTabNoIndexTitle} fontWeight={FontWeights.medium}>
                {__("Set noindex for this page:", "beyondseo")}
              </Text>
            </Switch>
            <Text className={styles.advancedTabNoIndexDescription} fontWeight={FontWeights.regular} fontSize={12}>
              {__(
                "Prevents this page from being indexed by search engines. Adds a noindex tag to exclude this page from search results.",
                "beyondseo",
              )}
            </Text>
          </div>

          <div className={VanguardStyle.mb0}>
            <Switch
              value={disableAutoLinks}
              labelPos="left"
              onChange={handleDisableAutoLinksCallback}
              disabled={isSubmitting}
              testId={`advanced-settings-switch`}
              className={styles.advancedTabRobotsSwitch}
            >
              <Text className={styles.advancedTabNoIndexTitle} fontWeight={FontWeights.medium}>
                {__("Disable mobile auto-links for this page:", "beyondseo")}
              </Text>
            </Switch>
            <Text className={styles.advancedTabNoIndexDescription} fontWeight={FontWeights.regular} fontSize={12}>
              {__(
                "Disables automatic detection of phone numbers, email addresses, and physical addresses in this page’s content. Prevents mobile browsers from converting them into clickable links.",
                "beyondseo",
              )}
            </Text>
            </div>

            <div className={VanguardStyle.mb0}>
              <Switch
                value={viewportForPage}
                labelPos="left"
                onChange={handleSaveViewportCallback}
                disabled={isSubmitting}
                testId={`advanced-settings-viewport-switch`}
                className={styles.advancedTabRobotsSwitch}
              >
                <Text className={styles.advancedTabNoIndexTitle} fontWeight={FontWeights.medium}>
                  {__("Enable viewport meta tag for this page:", "beyondseo")}
                </Text>
              </Switch>
              <Text className={styles.advancedTabNoIndexDescription} fontWeight={FontWeights.regular} fontSize={12}>
                {__(
                  "Adds a responsive viewport meta tag to this page. Ensures proper display on mobile devices by setting width=device-width and initial-scale=1.",
                  "beyondseo",
                )}
              </Text>
            </div>

            {/*<div className={VanguardStyle.mb0}>*/}
          {/*  <Switch*/}
          {/*    value={excludeSitemapForPage}*/}
          {/*    labelPos="left"*/}
          {/*    onChange={handleSaveExcludeSitemapCallback}*/}
          {/*    disabled={isSubmitting}*/}
          {/*    testId={`advanced-settings-switch`}*/}
          {/*    className={styles.advancedTabRobotsSwitch}*/}
          {/*  >*/}
          {/*    <Text className={styles.advancedTabExcludeSitemapTitle} fontWeight={FontWeights.medium}>*/}
          {/*      {__("Exclude this page from sitemap:", "beyondseo")}*/}
          {/*    </Text>*/}
          {/*  </Switch>*/}
          {/*  <Text className={styles.advancedTabNoIndexDescription} fontWeight={FontWeights.regular} fontSize={12}>*/}
          {/*    {__(*/}
          {/*      "Prevents this page from appearing in the sitemap. Excludes this page from the sitemap, reducing its visibility to search engines.",*/}
          {/*      "beyondseo",*/}
          {/*    )}*/}
          {/*  </Text>*/}
          {/*</div>*/}

          <div className={VanguardStyle.mb0}>
            <Text className={styles.advancedTabCanonicalTitle} fontWeight={FontWeights.medium}>
              {__("Canonical URL", "beyondseo")}
            </Text>
            <Input
              formconfig={formConfig.canonicalUrl}
              labelType="outer"
              placeholder={__("Enter canonical URL", "beyondseo")}
              value={canonicalUrl}
              required={true}
              onBlur={handleSaveCanonicalUrlCallback}
              textFieldProps={{
                multiline: true,
                rows: 1,
              }}
            />
          </div>
        </Form>
      </ComponentContainer>
    </div>
  );
};
