import * as React from "react";
import {useState} from "react";
import styles from "./OnboardingSummaryKeyword.module.scss";
import {Button, ButtonSizes, ButtonTypes, classNames, ComponentContainer, EditableCard, FontWeights, GeneratedWithAIPill, Input, TagList, TagProps, Text, TextTypes,} from "vanguard";
import emptyStateUfo from "@src/custom-hooks/use-dynamic-import/assets/empty-states/empty-state-ufo.svg";
import {WPRequirementObjectType} from "@src/models/swagger/BeyondSEO/Domain/Integrations/WordPress/Setup/Entities/Flows/Requirements/WPRequirement";
import {useAppDispatch} from "@src/custom-hooks/use-app-dispatch";
import {OnboardingStore} from "@src/stores/swagger/api/OnboardingStore";
import {__} from "@wordpress/i18n";

const MAX_KEYWORDS = 50;

interface OnboardingSummaryKeywordProps {
  keywords: Array<{ id: number; text: string }>;
  setKeywords: React.Dispatch<React.SetStateAction<Array<{ id: number; text: string }>>>;
}

export const OnboardingSummaryKeyword: React.FC<OnboardingSummaryKeywordProps> = ({ keywords, setKeywords }) => {
  const [newKeyword, setNewKeyword] = useState("");
  const [keywordError, setKeywordError] = useState("");
  const dispatch = useAppDispatch();

  const updateSingleRequirement = (setupRequirementName: string, value: string) => {
    dispatch(
      OnboardingStore.postApiOnboardingRequirementsThunk({
        requestBody: {
          requirement: {
            setupRequirement: setupRequirementName,
            value: value,
            objectType:
              WPRequirementObjectType.BeyondSEO_Domain_Integrations_WordPress_Setup_Entities_Flows_Requirements_WPRequirement,
          },
        },
        queryParams: {},
      }),
    );
  };

  const handleKeywordDelete = (id?: string | number) => {
    if (id !== undefined) {
      setKeywords((prevKeywords) => {
        const newKeywords = prevKeywords.filter((keyword) => keyword.id !== Number(id));
        updateSingleRequirement("businessKeywords", JSON.stringify(newKeywords.map((k) => k.text)));
        return newKeywords;
      });
    }
  };

  const handleKeywordInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewKeyword(e.target.value);

    if (keywordError) {
      setKeywordError("");
    }
  };

  const handleKeywordInputKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      processAndAddKeywords();
    }
  };

  const processAndAddKeywords = () => {
    if (newKeyword.includes(",")) {
      // Split by comma and process each keyword
      const keywordsList = newKeyword
        .split(",")
        .map((k) => k.trim())
        .filter((k) => k);

      // Process each keyword sequentially
      const processKeywords = async () => {
        for (const keyword of keywordsList) {
          if (keyword.length >= 3) {
            // Process each keyword with all validations
            if (keyword.length > 80) {
              setKeywordError(__("A keyword can have max 80 characters", "beyondseo"));
              continue;
            }

            if (keywords.length >= MAX_KEYWORDS) {
              setKeywordError(__("You have reached max number of keywords", "beyondseo"));
              break;
            }

            const isDuplicate = keywords.some((k) => k.text.toLowerCase() === keyword.toLowerCase());

            if (isDuplicate) {
              continue; // Skip duplicates quietly during batch processing
            }

            // Add the keyword
            setKeywords((prevKeywords) => {
              const newKeywords = [
                ...prevKeywords,
                { id: Math.max(...prevKeywords.map((k) => k.id), 0) + 1, text: keyword },
              ];
              updateSingleRequirement("businessKeywords", JSON.stringify(newKeywords.map((k) => k.text)));
              return newKeywords;
            });

            // Wait for the keyword to be added before continuing
            await new Promise((resolve) => setTimeout(resolve, 10));
          }
        }

        setNewKeyword("");
        setKeywordError("");
      };

      processKeywords();
    } else {
      handleAddKeyword();
    }
  };

  const handleAddKeyword = () => {
    const trimmedKeyword = newKeyword.trim();
    if (trimmedKeyword && trimmedKeyword.length >= 3) {
      if (trimmedKeyword.length > 80) {
        setKeywordError(__("A keyword can have max 80 characters", "beyondseo"));
        return;
      }

      if (keywords.length >= MAX_KEYWORDS) {
        setKeywordError(__("You have reached max number of keywords", "beyondseo"));
        return;
      }

      const isDuplicate = keywords.some((keyword) => keyword.text.toLowerCase() === trimmedKeyword.toLowerCase());

      if (isDuplicate) {
        setKeywordError(__("You have already added this keyword", "beyondseo"));
        return;
      }

      setKeywordError("");
      setKeywords((prevKeywords) => {
        const newKeywords = [
          ...prevKeywords,
          { id: Math.max(...prevKeywords.map((k) => k.id), 0) + 1, text: trimmedKeyword },
        ];
        updateSingleRequirement("businessKeywords", JSON.stringify(newKeywords.map((k) => k.text)));
        return newKeywords;
      });
      setNewKeyword("");
    }
  };

  return (
    <ComponentContainer className={classNames(styles.editableCardWrapper)}>
      <EditableCard
        className="editableCard"
        title={__("Keywords to be used for SEO", "beyondseo")}
        editCallback={() => {}}
        hideEditButton={true}
        padding={true}
        editButtonFloatRight={true}
        actionBtns={keywords.length > 0 ? <GeneratedWithAIPill text={__("Generated by us",'beyondseo')} /> : undefined}
      >
        <ComponentContainer className={styles.keywordInputContainer}>
          <div className={styles.keywordInputWrapper}>
            <Input
              required={true}
              label={__("Add new keyword", "beyondseo")}
              placeholder={__("Enter new keyword (minimum 3 characters)", "beyondseo")}
              className={classNames(styles.keywordInput, keywordError ? styles.errorInput : "")}
              inputClassName={classNames(styles.keywordInputField)}
              value={newKeyword}
              onChange={handleKeywordInputChange}
              onKeyDown={handleKeywordInputKeyDown}
              infoText={__(`Minimum required keywords: 5.`, 'beyondseo')}
            />
            {keywordError && (
              <Text type={TextTypes.textHelp} className={styles.errorText}>
                {keywordError}
              </Text>
            )}
          </div>
          <Button
            type={ButtonTypes.primary}
            size={ButtonSizes.large}
            onClick={processAndAddKeywords}
            disabled={!newKeyword.trim() || newKeyword.trim().length < 3}
          >
            {__("Add", "beyondseo")}
          </Button>
        </ComponentContainer>
        {keywords.length > 0 ? (
          <TagList
            tags={keywords.reduce((tags: TagProps[], element) => {
              tags.push({
                id: element.id,
                text: element.text,
                hasDeleteBtn: true,
                deleteBtnCallback: handleKeywordDelete,
              });
              return tags;
            }, [])}
          />
        ) : (
          <div className={styles.empty}>
            <img className={classNames(styles.img)} src={emptyStateUfo} alt="empty keywords" />
            <Text type={TextTypes.textIntro} fontWeight={FontWeights.bold}>
              {__("You don`t have any keywords at the moment", "beyondseo")}
            </Text>
          </div>
        )}
      </EditableCard>
    </ComponentContainer>
  );
};
