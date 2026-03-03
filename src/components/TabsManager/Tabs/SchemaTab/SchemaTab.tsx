import * as React from "react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button, classNames, ComponentContainer, FontWeights, Select, VanguardStyle } from "vanguard";
import { SeoStore } from "@stores/swagger/rankingcoach/SeoStore";
import { getPathId } from "@helpers/get-path-id";
import { RootState } from "@src/main.store";
import { useAppDispatch } from "@hooks/use-app-dispatch";
import { SERPPreview } from "@components/SEOMetadataAndKeywords/SEOMetadata/SERPPreview/SERPPreview";
import tabStyles from "../Tabs.module.scss";
import { useScoreRecalculation } from "@contexts/ScoreRecalculationContext";
import { Text } from "vanguard";
import { __ } from "@wordpress/i18n";
import { SchemaTabPlaceholder } from "./SchemaTabPlaceholder";
import styles from "./SchemaTab.module.scss";

export const SchemaTab = () => {
  const dispatch = useAppDispatch();
  let currentPostId = getPathId();

  const { currentPost, isCurrentPostLoaded } = useSelector((state: RootState) => state.post);
  const { schemaMarkup } = useSelector((state: RootState) => state.app);
  const { triggerRecalculation } = useScoreRecalculation();

  const [schemaTypes, setSchemaTypes] = useState<string[]>([]);
  const [selectedSchemaType, setSelectedSchemaType] = useState<string>("BlogPosting");
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleButtonClick = async () => {
    if (currentPostId <= 0) {
      return;
    }
    try {
      setIsGenerating(true);
      setShowSuccess(false);
      const response = await dispatch(
        SeoStore.postRankingcoachSeoSchemaMarkupSaveByIdThunk({
          id: currentPostId,
          requestBody: {
            postId: currentPostId.toString(),
            selectedSchema: selectedSchemaType,
          },
          queryParams: {},
        }),
      );

      if (response?.payload?.response) {
        setShowSuccess(true);
      }

      // Trigger immediate recalculation after schema generation
      triggerRecalculation(true);
    } catch (error) {
      setShowSuccess(false);
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    const initializeSchema = async () => {
      try {
        if (schemaMarkup) {
          if (schemaMarkup.schemaTypes?.length > 0) {
            setSchemaTypes(schemaMarkup.schemaTypes);
          }

          if (schemaMarkup.currentPostSchemaType) {
            setSelectedSchemaType(schemaMarkup.currentPostSchemaType);
          } else if (schemaMarkup.schemaTypes?.length > 0) {
            setSelectedSchemaType(schemaMarkup.schemaTypes[0]);
          }

          setIsInitialized(true);
          setIsLoading(false);
        }
      } catch (error) {
        setIsLoading(false);
      }
    };

    if (schemaMarkup) {
      initializeSchema();
    }
  }, [schemaMarkup]);

  useEffect(() => {
    const fetchSchemaData = async () => {
      setIsLoading(true);
      try {
        await dispatch(
          SeoStore.getRankingcoachSeoSchemaMarkupByIdThunk({
            id: currentPostId,
          }),
        );
      } catch (error) {
        setIsLoading(false);
      }
    };

    if (currentPostId > 0) {
      fetchSchemaData();
    }
  }, [currentPostId]);

  useEffect(() => {
  }, [selectedSchemaType]);

  useEffect(() => {
    if (isCurrentPostLoaded) {
      currentPostId = currentPost?.id ? currentPost.id : 0;
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

  if (isLoading || !isInitialized) {
    return <SchemaTabPlaceholder />;
  }

  return (
    <div className={classNames(tabStyles.tabContent, "optimisation-tab-container")}>
      <ComponentContainer className={classNames(VanguardStyle.dFlex, VanguardStyle.gap8, VanguardStyle.flexWrap)}>
        <ComponentContainer className={classNames(VanguardStyle.flexGrow4)}>
          <Text fontWeight={FontWeights.bold}>{__("Schema in use", "beyondseo")}</Text>
          {!isLoading && (
            <Select
              onChange={(e:any) => {
                setSelectedSchemaType(e.target.value);
              }}
              value={selectedSchemaType}
              options={schemaTypes.map((schemaType) => ({
                key: schemaType,
                value: schemaType,
                title: schemaType,
              }))}
            />
          )}

          <ComponentContainer
            className={classNames(
              VanguardStyle.mt4,
              VanguardStyle.dFlex,
              VanguardStyle.justifyContentStart,
              VanguardStyle.gap8,
            )}
          >
            <Button
              className={VanguardStyle.mb1}
              onClick={handleButtonClick}
              isLoading={isGenerating}
              disabled={isLoading || isGenerating}
            >
              {__("Generate Schema", "beyondseo")}
            </Button>
            {/*<Button*/}
            {/*  onClick={handleButtonClick}*/}
            {/*  type={ButtonTypes.secondary}*/}
            {/*>*/}
            {/*  Validate Schema*/}
            {/*</Button>*/}
          </ComponentContainer>

          {/* Display schema data if available */}
          {schemaMarkup?.currentPostSchemaData && showSuccess && (
            <ComponentContainer
              className={classNames(VanguardStyle.mt4)}
              style={{ display: "inline-grid", marginTop: 0 }}
            >
              {/* <Text>Generated Schema Data</Text>*/}
              {/*<div*/}
              {/*  style={{*/}
              {/*    backgroundColor: '#f5f5f5',*/}
              {/*    padding: '10px',*/}
              {/*    borderRadius: '4px',*/}
              {/*    maxHeight: '300px',*/}
              {/*    overflow: 'auto',*/}
              {/*    fontSize: '12px',*/}
              {/*    fontFamily: 'monospace',*/}
              {/*  }}*/}
              {/*>*/}
              {/*  <pre>{JSON.stringify(schemaMarkup.currentPostSchemaData, null, 2)}</pre>*/}
              {/*</div>*/}
              {/*{schemaMarkup.fromCache && (*/}
              {/*  <small style={{ color: "#666", marginTop: "5px", display: "block" }}>*/}
              {/*    ✓ {__("Schema loaded from cache", "beyondseo")}*/}
              {/*  </small>*/}
              {/*)}*/}
              <small style={{ color: "#28a745", marginTop: "5px", display: "block" }}>
                ✓ {__("Schema generated successfully", "beyondseo")}
              </small>
            </ComponentContainer>
          )}

          {schemaMarkup?.error && (
            <ComponentContainer
              className={classNames(VanguardStyle.mt4)}
              style={{ display: "inline-grid", marginTop: 0 }}
            >
              <div
                style={{
                  backgroundColor: "#f8d7da",
                  color: "#721c24",
                  padding: "10px",
                  borderRadius: "4px",
                  border: "1px solid #f5c6cb",
                }}
              >
                <strong>{__("Error:", "beyondseo")}</strong> {schemaMarkup.error}
              </div>
            </ComponentContainer>
          )}
        </ComponentContainer>
        <ComponentContainer className={VanguardStyle.flexGrow1}>
          <SERPPreview openInNewTab={true} />
        </ComponentContainer>
      </ComponentContainer>
    </div>
  );
};
