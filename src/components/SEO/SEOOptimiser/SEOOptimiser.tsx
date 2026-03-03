import * as React from "react";
import { useEffect, useState } from "react";
import styles from "./SEOOptimiser.module.scss";
import {
  Button,
  ButtonSizes,
  ButtonTypes,
  classNames,
  ComponentContainer,
  FontWeights,
  IconNames,
  LottieAnimationLoader,
  Render,
  Text,
  TextTypes,
  VanguardStyle,
} from "vanguard";
import rcLogo from "@assets/rc-logo.svg";
import * as loadingOptimization from "@assets/animations/loading-optimization.json";
import { useSelector } from "react-redux";
import { RootState } from "@src/main.store";
import { useAppDispatch } from "@hooks/use-app-dispatch";
import { getPathId } from "@helpers/get-path-id";
import { WPSetup } from "@models/swagger/BeyondSEO/Domain/Integrations/WordPress/Setup/Entities/WPSetup";
import { WPKeywordsAnalysis } from "@models/swagger/BeyondSEO/Domain/Integrations/WordPress/Seo/Entities/WebPages/Content/Elements/ContentAnalysis/WPKeywordsAnalysis";
import { MetatagsStore } from "@stores/swagger/api/MetatagsStore";
import { __ } from "@wordpress/i18n";
import {AppSlice} from "@src/App.slice";

export enum SEOOptimiserSizeType {
  Small = "small",
  Expanded = "expanded",
}
const SizeTypeEnum: typeof SEOOptimiserSizeType = SEOOptimiserSizeType;

export type SEOOptimiserProps = {
  headerText?: string;
  loadingText?: string;
  noKeywordsText?: string;
  noKeywordsDescription?: string;
  skipButtonText?: string;
  useButtonText?: string;
  useKwdButtonText?: string;
  skipKwdButtonText?: string;
  closeButtonText?: string;
  seoScore?: number | undefined;
  onCloseFunction: () => void;
  onUseKeywordsFunction: (keywords: WPKeywordsAnalysis) => void;
};

export const SEOOptimiser = (props: SEOOptimiserProps) => {
  const {
    plugin,
    hasValidSEOKeywords,
    postSeoOptimiserLoading,
    postSeoOptimiserKeywords = undefined,
    primaryKeyword,
    additionalKeywords,
  } = useSelector((state: RootState) => state.app);
  const { setPostSeoOptimiserLoading, setHasValidSEOKeywords } = AppSlice;
  const dispatch = useAppDispatch();
  const onboarding: WPSetup | undefined = plugin?.pluginData?.setupData ? plugin?.pluginData?.setupData : undefined;
  const internalOnboarding: boolean = !!onboarding?.isPluginOnboarded;

  if (!internalOnboarding) {
    return null;
  }

  const {
    headerText,
    loadingText,
    seoScore = undefined,
    noKeywordsText,
    noKeywordsDescription,
    closeButtonText,
    useKwdButtonText,
    skipKwdButtonText,
    onCloseFunction,
    onUseKeywordsFunction,
  } = props;
  const [sizeType, setSizeType] = useState<SEOOptimiserSizeType>(SizeTypeEnum.Small);
  const [title, setTitle] = useState<string>("");
  const [subtitle, setSubtitle] = useState<string>("");
  const [isTransitioning, setIsTransitioning] = useState(false);

  const isSmall: boolean = sizeType === SizeTypeEnum.Small;
  const isExpanded: boolean = sizeType === SizeTypeEnum.Expanded;

  const debouncedSizeChange = (newSize: SEOOptimiserSizeType) => {
    if (isTransitioning || sizeType === newSize) return;

    setIsTransitioning(true);
    setSizeType(newSize);

    setTimeout(() => {
      setIsTransitioning(false);
    }, 650);
  };

  const clickHandler = () => {
    if (isSmall && !isTransitioning) {
      debouncedSizeChange(SizeTypeEnum.Expanded);
    }
  };

  useEffect(() => {
    if (hasValidSEOKeywords != undefined) {
      if (!hasValidSEOKeywords) {
        setTitle(noKeywordsText as string);
        setSubtitle(noKeywordsDescription as string);
        debouncedSizeChange(SizeTypeEnum.Expanded);
      }
      if (hasValidSEOKeywords) {
        setTitle("");
        setSubtitle("");
        debouncedSizeChange(SizeTypeEnum.Expanded);
      }
    }
  }, [postSeoOptimiserLoading === false]);

  useEffect(() => {
    const handleKeywordsUpdated = () => {
      if (isExpanded && (primaryKeyword || (additionalKeywords && additionalKeywords.length > 0))) {
        onCloseFunction && onCloseFunction();
      }
    };

    document.addEventListener("rankingcoach-keywords-updated", handleKeywordsUpdated);

    return () => {
      document.removeEventListener("rankingcoach-keywords-updated", handleKeywordsUpdated);
    };
  }, [isExpanded, primaryKeyword, additionalKeywords, onCloseFunction]);

  useEffect(() => {
    setTitle(loadingText as string);

    // Block AI keywords generation calls for all subscriptions
    const disableKeywordsOptimiser = true;
    if (disableKeywordsOptimiser) {
      dispatch(setPostSeoOptimiserLoading(false));
      dispatch(setHasValidSEOKeywords(false));
      return;
    }

    if (plugin?.rcSubscriptionName === "Free") {
      dispatch(
        MetatagsStore.postApiMetatagsContentKeywordsByPostIdThunk.pending("request-id", {
          postId: getPathId(),
          requestBody: null,
          queryParams: { noCache: true, debug: true },
        }),
      );

      setTimeout(() => {
        dispatch(
          MetatagsStore.postApiMetatagsContentKeywordsByPostIdThunk.rejected(
            new Error("Free subscription - AI keyword generation not available"),
            "request-id",
            {
              postId: getPathId(),
              requestBody: null,
              queryParams: { noCache: true, debug: true },
            },
          ),
        );
      }, 2000);
    } else {
      dispatch(
        MetatagsStore.postApiMetatagsContentKeywordsByPostIdThunk({
          postId: getPathId(),
          requestBody: null,
          queryParams: { noCache: true, debug: true },
        }),
      );
    }
  }, [seoScore == undefined, plugin?.rcSubscriptionName]);

  const notSuccess = hasValidSEOKeywords === false && postSeoOptimiserLoading === false;
  const withSuccess = hasValidSEOKeywords === true && postSeoOptimiserLoading === false;

  return (
    <Render
      if={
        seoScore == undefined &&
        plugin?.pluginData?.setupData?.isPluginOnboarded == true &&
        plugin?.pluginData?.setupData?.isApplicationOnboarded == true
      }
    >
      <ComponentContainer
        className={classNames(
          styles.seoOptimiserContainer,
          isExpanded ? styles.expanded : styles.small,
          isTransitioning ? styles.transitioning : "",
        )}
        onClick={clickHandler}
      >
        <div className={styles.header}>
          <div className={styles.logo}>
            <img className={styles.logoImage} src={rcLogo} alt={"svg-image"} />
            <Text type={TextTypes.textCaption} color={"--n400"} className={classNames(styles.title, VanguardStyle.mr3)}>
              {headerText}
            </Text>
          </div>
          <div className={styles.close}>
            <Render if={isExpanded && postSeoOptimiserLoading === true}>
              <Button
                type={ButtonTypes.secondary}
                iconLeft={IconNames.close}
                size={ButtonSizes.small}
                color={"--n400"}
                onClick={() => {
                  debouncedSizeChange(SizeTypeEnum.Small);
                }}
              />
            </Render>
          </div>
        </div>
        <div className={classNames(styles.content)}>
          <ComponentContainer
            testId={"loading-optimization-testId"}
            className={classNames(
              styles.loadingOptimizationContainer,
              withSuccess ? styles.success : "",
              VanguardStyle.dFlex,
              VanguardStyle.justifyContentCenter,
              VanguardStyle.alignContentCenter,
              isExpanded ? styles.expanded : styles.small,
            )}
          >
            <Text className={styles.contentText} fontWeight={FontWeights.medium} fontSize={isExpanded ? 19 : 0}>
              {title}
            </Text>
            <Text className={styles.contentText} fontWeight={FontWeights.regular} fontSize={isExpanded ? 16 : 0}>
              {subtitle}
            </Text>

            <Render if={notSuccess}>
              <Button
                className={classNames(VanguardStyle.mb1, VanguardStyle.mt2)}
                size={ButtonSizes.small}
                onClick={() => {
                  onCloseFunction && onCloseFunction();
                }}
              >
                {closeButtonText}
              </Button>
            </Render>

            <Render if={withSuccess}>
              <div className={classNames(styles.noKeywordsWrapper, VanguardStyle.mb3, VanguardStyle.textAlignCenter)}>
                <Text
                  className={classNames(styles.contentTitle, VanguardStyle.mb2)}
                  fontWeight={FontWeights.medium}
                  fontSize={22}
                >
                  This page doesn't have keywords
                </Text>
                <Text className={styles.contentSubtitle} fontWeight={FontWeights.regular} fontSize={16}>
                  {__(
                    "Using the right keywords can significantly increase your website`s visibility, making it easier for people to find it.",
                    "beyondseo",
                  )}
                </Text>
              </div>
              <Text
                type={TextTypes.heading3}
                fontWeight={FontWeights.medium}
                fontSize={18}
                className={classNames(styles.contentText, VanguardStyle.mb4)} // Changed from mb2 to mb4 for more space
              >
                {"We've picked the most effective keywords"}
              </Text>
              <Text
                // fontWeight={FontWeights}
                fontSize={16}
                className={classNames(styles.contentText, VanguardStyle.mb3)} // Changed from mb1 to mb3 for more space
                type={TextTypes.heading3}
              >
                <b>{"Primary keyword: "}</b>
                {postSeoOptimiserKeywords?.primaryKeywordFromExisting?.name ||
                  postSeoOptimiserKeywords?.primaryKeywordFromContent?.name}
              </Text>
              <Render
                if={
                  !!(postSeoOptimiserKeywords?.additionalKeywordsFromExisting?.elements?.length ?? false) ||
                  !!(postSeoOptimiserKeywords?.additionalKeywordsFromContent?.elements?.length ?? false)
                }
              >
                <Text
                  fontWeight={FontWeights.regular}
                  fontSize={16}
                  className={classNames(styles.contentText, VanguardStyle.mb1)}
                >
                  <b>{"Additional keywords: "}</b>
                  {postSeoOptimiserKeywords?.additionalKeywordsFromExisting?.elements?.map((keyword) => {
                    return keyword.name + ", ";
                  })}
                  {postSeoOptimiserKeywords?.additionalKeywordsFromContent?.elements?.map((keyword) => {
                    return keyword.name + ", ";
                  })}
                </Text>
              </Render>

              <ComponentContainer
                className={classNames(
                  VanguardStyle.dFlex,
                  VanguardStyle.justifyContentCenter,
                  VanguardStyle.alignItemsCenter,
                  VanguardStyle.gap9,
                )}
              >
                <Button
                  size={ButtonSizes.small}
                  className={classNames(VanguardStyle.mb1, VanguardStyle.mt2)}
                  onClick={() => {
                    if (onUseKeywordsFunction && postSeoOptimiserKeywords) {
                      onUseKeywordsFunction(postSeoOptimiserKeywords);
                    } else {
                      onCloseFunction && onCloseFunction();
                    }
                  }}
                >
                  {useKwdButtonText}
                </Button>
                <Button
                  size={ButtonSizes.small}
                  type={ButtonTypes.secondary}
                  className={classNames(VanguardStyle.mb1, VanguardStyle.mt2)}
                  onClick={() => {
                    onCloseFunction && onCloseFunction();
                  }}
                >
                  {skipKwdButtonText}
                </Button>
              </ComponentContainer>
            </Render>

            <Render if={postSeoOptimiserLoading === true}>
              <ComponentContainer
                testId={"loading-document-testId"}
                className={classNames(styles.loadingImage, isExpanded ? VanguardStyle.mt1 : "")}
                onClick={clickHandler}
              >
                <LottieAnimationLoader src={loadingOptimization} />
              </ComponentContainer>
            </Render>
          </ComponentContainer>
        </div>
      </ComponentContainer>
    </Render>
  );
};
