import React from "react";
import {
  Accordion,
  Button,
  ButtonSizes,
  ButtonTypes,
  classNames,
  FontWeights,
  Icon,
  IconNames,
  IconSize,
  Text,
  TextIcon,
  TextTypes,
} from "vanguard";
import styles from "./GutenbergSidebar.module.scss";
import {
  AccordionItem,
  ContentCategory,
  getScoreStyleClass,
  getIconPropertiesByScore,
  ICON_STYLES,
} from "./GutenbergSidebarHelpers";

// Type definitions
type SuggestionAccordionItemProps = {
  suggestion: { title: string; description: string };
  index: number;
  expandedContentItems: { [key: string]: boolean };
  handleContentItemExpand: (itemKey: string, expanded: boolean) => void;
};

type ContentAccordionItemProps = {
  item: AccordionItem;
  index: number;
  expandedContentItems: { [key: string]: boolean };
  handleContentItemExpand: (itemKey: string, expanded: boolean) => void;
};

type ContentCategoryComponentProps = {
  category: ContentCategory;
  index: number;
  expandedCategories: { [key: string]: boolean };
  handleCategoryExpand: (categoryId: string, expanded: boolean) => void;
  expandedContentItems: { [key: string]: boolean };
  handleContentItemExpand: (itemKey: string, expanded: boolean) => void;
};

// Suggestion accordion item component
export const SuggestionAccordionItem = (props: SuggestionAccordionItemProps) => {
  const { suggestion, index, expandedContentItems, handleContentItemExpand } = props;
  const suggestionKey = `suggestion-${suggestion.title.toLowerCase().replace(/\s+/g, "")}-${index}`;
  const isExpanded = expandedContentItems[suggestionKey] || false;

  return (
    <div className={styles.suggestionAccordionItem}>
      <div className={styles.suggestionItemHeader} onClick={() => handleContentItemExpand(suggestionKey, !isExpanded)}>
        <div className={styles.suggestionItemTitle}>
          <TextIcon
            icon={ICON_STYLES.RECOMMENDATION.icon}
            iconColor={ICON_STYLES.RECOMMENDATION.color}
            verticalAlign="center"
            iconHasCircle={ICON_STYLES.RECOMMENDATION.hasCircle}
            iconSize={IconSize.small}
            className={styles.suggestionItem}
          >
            {suggestion.title}
          </TextIcon>
        </div>

        <Button
          type={ButtonTypes.default}
          iconLeft={isExpanded ? IconNames.caretUp : IconNames.caretDown}
          size={ButtonSizes.small}
          onClick={(e) => {
            e.stopPropagation();
            handleContentItemExpand(suggestionKey, !isExpanded);
          }}
          className={styles.suggestionItemToggle}
        />
      </div>
      <div className={classNames(styles.suggestionItemDetails, isExpanded ? styles.expanded : "")}>
        <Text type={TextTypes.text} color="--n600" fontSize={13}>
          {suggestion.description}
        </Text>
      </div>
    </div>
  );
};

// Content accordion item component
export const ContentAccordionItem = (props: ContentAccordionItemProps) => {
  const { item, index, expandedContentItems, handleContentItemExpand } = props;
  const itemKey = item.title.toLowerCase().replace(/\s+/g, "");
  const isExpanded = expandedContentItems[itemKey] || false;

  // Use score-based icon logic if score is available, otherwise fall back to status-based
  const iconProps =
    item.score !== undefined
      ? getIconPropertiesByScore(item.score)
      : {
          icon:
            item.status === "Incomplete" ? IconNames.exclamation : item.isPositive ? IconNames.check : IconNames.close,
          color: item.status === "Incomplete" ? "#ff9340" : item.isPositive ? "#21c445" : "#ff675c",
          fillColor: item.status === "Incomplete" ? "#fff5eb" : item.isPositive ? "#e9fbed" : "#ffeceb",
          hasCircle: true,
          circleSize: 24,
        };

  return (
    <div className={styles.contentAccordionItem} key={`content-item-${index}`}>
      <div
        className={classNames(styles.contentItemHeader, item.suggestions.length === 0 ? styles.notClickable : "")}
        onClick={() => {
          return item.suggestions.length > 0 && handleContentItemExpand(itemKey, !isExpanded);
        }}
      >
        <div className={styles.contentItemTitle}>
          <div className={!iconProps.hasCircle ? styles.triangle : ""}>
            <Icon
              color={iconProps.color}
              hasCircle={iconProps.hasCircle}
              fillColor={iconProps.fillColor}
              type={!iconProps.hasCircle ? IconSize.small : IconSize.large}
            >
              {iconProps.icon}
            </Icon>
          </div>
          <Text fontSize={14} type={TextTypes.text} color="--n600">
            {item.title}
          </Text>
        </div>
        {item.suggestions.length > 0 && (
          <Button
            type={ButtonTypes.default}
            iconLeft={isExpanded ? IconNames.caretUp : IconNames.caretDown}
            size={ButtonSizes.small}
            onClick={(e) => {
              e.stopPropagation();
              handleContentItemExpand(itemKey, !isExpanded);
            }}
            className={styles.contentItemToggle}
          />
        )}
      </div>
      <div className={classNames(styles.contentItemDetails, isExpanded ? styles.expanded : "")}>
        {item.suggestions.map((suggestion, idx) => (
          <SuggestionAccordionItem
            key={idx}
            suggestion={suggestion}
            index={idx}
            expandedContentItems={expandedContentItems}
            handleContentItemExpand={handleContentItemExpand}
          />
        ))}
      </div>
    </div>
  );
};

// Content category component
export const ContentCategoryComponent = (props: ContentCategoryComponentProps) => {
  const { category, index, expandedCategories, handleCategoryExpand, expandedContentItems, handleContentItemExpand } =
    props;
  const isExpanded = expandedCategories[category.id] || false;
  const scoreStyleClass = getScoreStyleClass(category.score);

  return (
    <Accordion
      key={`category-${category.id}`}
      expanded={isExpanded}
      defaultExpanded={index === 0}
      className={styles.accordion}
      accordionId={`category-${category.id}`}
      summaryChildren={
        <div className={styles.categoryAndScore}>
          <Text fontSize={14} type={TextTypes.text} className={classNames(styles.score, scoreStyleClass)}>
            {category.weightedScore}%
          </Text>
          <Text fontSize={14} type={TextTypes.text} fontWeight={FontWeights.bold} color="--n600">
            {category.title}
          </Text>
        </div>
      }
      detailsChildren={
        <div className={styles.contentAccordionContainer}>
          {category.items.map((item, idx) => (
            <ContentAccordionItem
              key={idx}
              item={item}
              index={idx}
              expandedContentItems={expandedContentItems}
              handleContentItemExpand={handleContentItemExpand}
            />
          ))}
        </div>
      }
      iconSize={IconSize.small}
      iconName={IconNames.caretDown}
      onExpandedChange={(expanded) => handleCategoryExpand(category.id, expanded)}
    />
  );
};
