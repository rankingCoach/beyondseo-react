import * as React from "react";
import { useEffect, useState, useRef, useCallback } from "react";
import debounce from "lodash.debounce";
import { FixedSizeList } from "react-window";
import styles from "./OnboardingSummary.module.scss";
import {
  Button,
  ButtonSizes,
  ButtonTypes,
  classNames,
  ComponentContainer,
  EditableCard,
  EditModal,
  FontWeights,
  Form,
  GeneratedWithAIPill,
  IconNames,
  Input,
  Popover,
  TagList,
  TagProps,
  Text,
  Textarea,
  TextIcon,
  TextTypes,
  VanguardStyle,
  Icon,
  IconSize,
  SearchableSelect
} from "vanguard";
import { useAppDispatch } from "@src/custom-hooks/use-app-dispatch";
import { OnboardingStore } from "@src/stores/swagger/api/OnboardingStore";
import emptyStateUfo from "@src/custom-hooks/use-dynamic-import/assets/empty-states/empty-state-ufo.svg";
import { WPRequirementObjectType } from "@src/models/swagger/BeyondSEO/Domain/Integrations/WordPress/Setup/Entities/Flows/Requirements/WPRequirement";
import { OnboardingSummaryKeyword } from "./OnboardingSummaryKeyword/OnboardingSummaryKeyword";
import { ErrorModal } from "@src/components/Common/ErrorModal/ErrorModal";
import { __ } from "@wordpress/i18n";
import { OnboardingSummaryPlaceholder } from "./OnboardingSummaryPlaceholder";
import { OnboardingSummaryAddress } from "./OnboardingSummaryAddress";
import { hasRooftopPrecision } from "@src/helpers/geo-helpers";

// Custom Category Search Select Component for async loading with infinite scroll
interface CategorySearchSelectProps {
  searchText: string;
  onSearchChange: (value: string) => void;
  options: Array<{ value: string; title: string }>;
  onSelection: (value: string) => void;
  value: string;
  isLoading: boolean;
  placeholder: string;
  onLoadMore: () => void;
  hasMore: boolean;
  totalCount: number;
}

const CategorySearchSelect: React.FC<CategorySearchSelectProps> = ({
  searchText,
  onSearchChange,
  options,
  onSelection,
  value,
  isLoading,
  placeholder,
  onLoadMore,
  hasMore,
  totalCount,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const listRef = useRef<any>(null);

  useEffect(() => {
    if (!isOpen) return;

    const onPointerDownCapture = (e: Event) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      if (target.closest(".category-search-select-wrapper")) return;

      setIsOpen(false);
    };

    const onKeyDownCapture = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", onPointerDownCapture, true);
    document.addEventListener("keydown", onKeyDownCapture, true);

    return () => {
      document.removeEventListener("pointerdown", onPointerDownCapture, true);
      document.removeEventListener("keydown", onKeyDownCapture, true);
    };
  }, [isOpen]);

  const handleScroll = useCallback(({ scrollOffset, scrollUpdateWasRequested }: any) => {
    if (scrollUpdateWasRequested || !listRef.current) return;

    const listHeight = 350;
    const itemHeight = 44;
    const totalHeight = options.length * itemHeight;
    const scrollThreshold = 100;

    if (totalHeight - scrollOffset - listHeight < scrollThreshold) {
      if (hasMore && !isLoading) {
        onLoadMore();
      }
    }
  }, [hasMore, isLoading, onLoadMore, options.length]);

  const showInitialState = !searchText || searchText.length < 2;

  // Row renderer for virtualized list
  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const option = options[index];
    return (
      <div
        style={style}
        className={styles.dropdownItem}
        onClick={() => {
          onSelection(option.value);
          setIsOpen(false);
        }}
      >
        <Text>{option.title}</Text>
      </div>
    );
  };

  return (
    <ComponentContainer className={classNames("category-search-select-wrapper")}>
      <Input
        value={searchText}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value)}
        placeholder={placeholder}
        label={false}
        onFocus={() => setIsOpen(true)}
      />
      {isOpen && (
        <ComponentContainer
          className={styles.categoryDropdown}
        >
          {options.length === 0 && isLoading ? (
            <ComponentContainer className={styles.dropdownMessage}>
              <Icon type={IconSize.large} className={"loader-spinner"}>
                {IconNames.save}
              </Icon>
              <Text type={TextTypes.textCaption}>{__("Loading categories...", "beyondseo")}</Text>
            </ComponentContainer>
          ) : searchText.length > 0 && searchText.length < 2 ? (
            <ComponentContainer className={styles.dropdownMessage}>
              <Text type={TextTypes.textCaption}>
                {__("Type at least 2 characters to search categories", "beyondseo")}
              </Text>
            </ComponentContainer>
          ) : options.length === 0 && !isLoading ? (
            <ComponentContainer className={styles.dropdownMessage}>
              <Text type={TextTypes.textCaption}>{__("No categories found for your search.", "beyondseo")}</Text>
            </ComponentContainer>
          ) : (
            <>
              <FixedSizeList
                ref={listRef}
                height={Math.min(350, options.length * 44)}
                itemCount={options.length}
                itemSize={44}
                width="100%"
                onScroll={handleScroll}
                className={styles.virtualList}
              >
                {Row}
              </FixedSizeList>
              {isLoading && (
                <ComponentContainer className={styles.dropdownLoadingMore}>
                  <Icon type={IconSize.small} className={"loader-spinner"}>
                    {IconNames.save}
                  </Icon>
                  <Text type={TextTypes.textCaption}>{__("Loading more...", "beyondseo")}</Text>
                </ComponentContainer>
              )}
              <ComponentContainer className={styles.dropdownFooter}>
                <Text type={TextTypes.textCaption}>
                  {options.length} {__("of", "beyondseo")} {totalCount} {__("categories", "beyondseo")}
                </Text>
              </ComponentContainer>
            </>
          )}
        </ComponentContainer>
      )}
      {isOpen && (
        <ComponentContainer className={styles.dropdownOverlay} onClick={() => setIsOpen(false)} />
      )}
    </ComponentContainer>
  );
};

export const WELCOME_TEXTS_STEP8 = "Here`s a summary of your website profile. Everything looks good?";
const IS_FORM_VALID_POPOVER_MESSAGE = __(
  "All fields are required. To finish onboarding, set your address on the map and add at least five keywords and one category.",
  "beyondseo",
);
const MAX_CATEGORIES = 10;
const MIN_KEYWORDS = 5;
const MIN_CATEGORIES = 1;
const NOT_ALLOWED_CHARACTERS_IN_BUSINESS_NAME_MESSAGE = __(
  "We cannot accept names with certain special characters, because these names must be published later uniformly in online directories, which partially reject these characters. This is in the best interest of your company, as publishing information in many online directories will significantly improve your local visibility and local rankings on Google",
  "beyondseo",
);

interface OnboardingSummaryProps {
  onFinish: () => Promise<void>;
  onCancel: () => void;
  websiteDescription: string;
  onDescriptionChange: (description: string) => void;
}

export const OnboardingSummary: React.FC<OnboardingSummaryProps> = ({
  onFinish,
  onCancel,
  websiteDescription,
  onDescriptionChange,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isFinishing, setIsFinishing] = useState(false);
  const [showDescriptionModal, setShowDescriptionModal] = useState(false);
  const [showBusinessInfoModal, setShowBusinessInfoModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [businessGeoAddress, setBusinessGeoAddress] = useState("");
  const [tempDescription, setTempDescription] = useState(websiteDescription);
  const [descriptionError, setDescriptionError] = useState("");
  const [tempBusinessName, setTempBusinessName] = useState(businessName);
  const [businessNameError, setBusinessNameError] = useState("");
  const [keywords, setKeywords] = useState<Array<{ id: number; text: string }>>([]);
  const [categories, setCategories] = useState<Array<{ id: number; text: string }>>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [searchOptions, setSearchOptions] = useState<Array<{ value: string; title: string }>>([]);
  const [categoryError, setCategoryError] = useState("");
  const [isCategoryLoading, setIsCategoryLoading] = useState(false);
  const [categorySearchText, setCategorySearchText] = useState("");
  const [categoryOffset, setCategoryOffset] = useState(0);
  const [categoryTotalCount, setCategoryTotalCount] = useState(0);
  const [hasMoreCategories, setHasMoreCategories] = useState(true);
  const [isAddressDisabled, setIsAddressDisabled] = useState(false);
  const [prefillAddressRequirement, setPrefillAddressRequirement] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    setIsLoading(true);
    dispatch(OnboardingStore.getApiOnboardingRequirementsThunk({}))
      .unwrap()
      .then((response) => {
        const requirements = response?.requirements?.elements;
        if (requirements) {
          const businessNameReq = requirements.find((req) => req.setupRequirement === "businessName");
          const websiteUrlReq = requirements.find((req) => req.setupRequirement === "businessWebsiteUrl");
          const descriptionReq = requirements.find((req) => req.setupRequirement === "businessDescription");
          const addressReq = requirements.find((req) => req.setupRequirement === "businessAddress");
          const keywordsReq = requirements.find((req) => req.setupRequirement === "businessKeywords");
          const categoriesReq = requirements.find((req) => req.setupRequirement === "businessCategories");
          const geoAddressReq = requirements.find((req) => req.setupRequirement === "businessGeoAddress");

          try {
            if (geoAddressReq?.value) {
              const geoAddress = JSON.parse(geoAddressReq.value);
              setBusinessGeoAddress(geoAddressReq.value);
              setIsAddressDisabled(!!geoAddress);

              // Check if address is prefilled
              if (geoAddress.prefilledAddress === true) {
                setPrefillAddressRequirement(true);
              }
            }
          } catch (e) {
            setIsAddressDisabled(false);
            setPrefillAddressRequirement(false);
          }

          if (businessNameReq?.value) {
            setBusinessName(businessNameReq.value);
            setTempBusinessName(businessNameReq.value);
          }

          if (websiteUrlReq?.value) {
            setWebsiteUrl(websiteUrlReq.value);
          }

          if (descriptionReq?.value) {
            onDescriptionChange(descriptionReq.value);
            setTempDescription(descriptionReq.value);
          }

          if (addressReq?.value) {
            setBusinessAddress(addressReq.value);
          }

          if (keywordsReq?.value) {
            try {
              const keywordArray = JSON.parse(keywordsReq.value).map((keyword: string, index: number) => ({
                id: index + 1,
                text: keyword.replace(/['"]+/g, "").trim(),
              }));
              setKeywords(keywordArray);
            } catch (e) {
              const keywordArray = keywordsReq.value.split(",").map((keyword, index) => ({
                id: index + 1,
                text: keyword.replace(/['"]+/g, "").trim(),
              }));
              setKeywords(keywordArray);
            }
          }

          if (categoriesReq?.value) {
            try {
              const categoryArray = JSON.parse(categoriesReq.value).map((category: string, index: number) => ({
                id: index + 1,
                text: category.replace(/['"]+/g, "").trim(),
              }));
              setCategories(categoryArray);
            } catch (e) {
              const categoryArray = categoriesReq.value.split(",").map((category, index) => ({
                id: index + 1,
                text: category.replace(/['"]+/g, "").trim(),
              }));
              setCategories(categoryArray);
            }
          }
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [dispatch]);

  // Load initial categories on mount (all categories)
  useEffect(() => {
    setIsCategoryLoading(true);
    dispatch(
      OnboardingStore.getApiOnboardingCategoriesThunk({
        search: "",
      }),
    )
      .unwrap()
      .then((response) => {
        if (response?.categories?.elements) {
          const allCategories = response.categories.elements.map((category, index) => ({
            value: `category-${index}-${category.name}`,
            title: category.name || "",
          }));
          // Initially show first 300 categories
          setSearchOptions(allCategories.slice(0, 300));
          setCategoryOffset(300);
          setCategoryTotalCount(allCategories.length);
          setHasMoreCategories(allCategories.length > 300);
          // Store all categories for later use
          (window as any).__allCategories = allCategories;
        }
      })
      .finally(() => {
        setIsCategoryLoading(false);
      });
  }, [dispatch]);

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

  const handleDescriptionEdit = () => {
    setTempDescription(websiteDescription);
    setShowDescriptionModal(true);
  };

  const handleDescriptionSave = () => {
    if (tempDescription.length > 750) {
      setDescriptionError(__("Website description can have maximum 750 characters.", "beyondseo"));
      return;
    }
    onDescriptionChange(tempDescription);
    setTempDescription(tempDescription);
    setShowDescriptionModal(false);
    updateSingleRequirement("businessDescription", tempDescription);
  };

  const handleBusinessInfoEdit = () => {
    setTempBusinessName(businessName);
    setShowBusinessInfoModal(true);
  };

  const handleBusinessInfoSave = () => {
    if (tempBusinessName.trim().length < 3) {
      setBusinessNameError(__("Please enter at least 3 characters.", "beyondseo"));
      return;
    }

    const forbiddenCharRegex = /[^\p{L}0-9()\[\]?:;\/!,・.\-%&_*§²`´·’"' +¡¿@“”\s]/u;

    if (forbiddenCharRegex.test(tempBusinessName)) {
      setBusinessNameError(__(NOT_ALLOWED_CHARACTERS_IN_BUSINESS_NAME_MESSAGE, "beyondseo"));
      return;
    }

    // Count punctuations using regex
    const punctuationCount = (tempBusinessName.match(/[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g) || []).length;
    if (punctuationCount > 6) {
      setBusinessNameError(__("This field contains too many punctuations. The maximum allowed is 6.", "beyondseo"));
      return;
    }

    setBusinessNameError("");
    setBusinessName(tempBusinessName);
    setShowBusinessInfoModal(false);
    updateSingleRequirement("businessName", tempBusinessName);
  };

  const handleAddressChange = (address: string, geoAddress: string) => {
    setBusinessAddress(address);
    setBusinessGeoAddress(geoAddress);
    updateSingleRequirement("businessAddress", address);
    updateSingleRequirement("businessGeoAddress", geoAddress);
    setPrefillAddressRequirement(false);
  };

  const handleAddCategory = (categoryText: string) => {
    setCategoryError("");
    if (!categoryText.trim()) return;

    if (categories.some((cat) => cat.text === categoryText.trim())) {
      setCategoryError(__("You already have added this category", "beyondseo"));
      return;
    }

    if (categories.length >= MAX_CATEGORIES) {
      setCategoryError(__("You can not add more than 10 categories", "beyondseo"));
      return;
    }

    setCategories((prevCategories) => {
      const newCategories = [
        ...prevCategories,
        { id: Math.max(...prevCategories.map((c) => c.id), 0) + 1, text: categoryText.trim() },
      ];
      updateSingleRequirement("businessCategories", JSON.stringify(newCategories.map((c) => c.text)));
      return newCategories;
    });
    setSelectedCategoryId("");
  };

  const handleCategoryDelete = (id?: string | number) => {
    if (id !== undefined) {
      setCategories((prevCategories) => {
        const newCategories = prevCategories.filter((category) => category.id !== Number(id));
        updateSingleRequirement("businessCategories", JSON.stringify(newCategories.map((c) => c.text)));
        return newCategories;
      });
    }
  };

  const handleCategorySelection = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    const selectedOption = searchOptions.find((opt) => opt.value === categoryId);
    if (selectedOption?.title) {
      handleAddCategory(selectedOption.title);
      setCategorySearchText("");
      // Reset to initial state with first 300 categories
      const allCategories = (window as any).__allCategories || [];
      setSearchOptions(allCategories.slice(0, 300));
      setCategoryOffset(300);
      setHasMoreCategories(allCategories.length > 300);
    }
  };

  // Auto-correct businessAddress when we have ROOFTOP precision in businessGeoAddress
  useEffect(() => {
    if (!businessGeoAddress) return;
    try {
      const geo = JSON.parse(businessGeoAddress);
      if (geo?.precision === "ROOFTOP" && geo?.formattedAddress && geo.formattedAddress !== businessAddress) {
        setBusinessAddress(geo.formattedAddress);
        updateSingleRequirement("businessAddress", geo.formattedAddress);
      }
    } catch (e) {
      // ignore parse errors
    }
  }, [businessGeoAddress]);

  const isFormValid = () => {
    return !!(
      websiteDescription?.trim() &&
      businessName?.trim() &&
      businessAddress?.trim() &&
      businessGeoAddress?.trim() &&
      hasRooftopPrecision(businessGeoAddress) &&
      keywords.length >= MIN_KEYWORDS &&
      categories.length >= MIN_CATEGORIES
    );
  };

  const handleFinish = async () => {
    if (isFinishing) return;

    setIsFinishing(true);

    try {
      onFinish();
    } catch (error: any) {
      setErrorMessage(error?.message || __("An unexpected error occurred", "beyondseo"));
      setShowErrorModal(true);
      setIsFinishing(false);
    }
  };

  const debouncedSearchRef = useRef(
    debounce((searchValue: string) => {
      if (searchValue.length >= 2) {
        setIsCategoryLoading(true);
        setCategoryOffset(0);
        dispatch(
          OnboardingStore.getApiOnboardingCategoriesThunk({
            search: searchValue,
          }),
        )
          .unwrap()
          .then((response) => {
            if (response?.categories?.elements) {
              const allResults = response.categories.elements.map((category, index) => ({
                value: `category-${index}-${category.name}`,
                title: category.name || "",
              }));
              // Show first 100 results when searching
              setSearchOptions(allResults.slice(0, 100));
              setCategoryOffset(100);
              setCategoryTotalCount(allResults.length);
              setHasMoreCategories(allResults.length > 100);
              // Store search results for pagination
              (window as any).__searchCategories = allResults;
            }
          })
          .finally(() => {
            setIsCategoryLoading(false);
          });
      }
    }, 400),
  );

  const handleCategorySearchChange = useCallback(
    (value: string) => {
      setCategorySearchText(value);
      if (value.length >= 2) {
        debouncedSearchRef.current(value);
      } else {
        // Reset to initial state when search is cleared
        const allCategories = (window as any).__allCategories || [];
        setSearchOptions(allCategories.slice(0, 300));
        setCategoryOffset(300);
        setCategoryTotalCount(allCategories.length);
        setHasMoreCategories(allCategories.length > 300);
      }
    },
    [dispatch],
  );

  const handleLoadMoreCategories = useCallback(() => {
    if (isCategoryLoading || !hasMoreCategories) return;

    setIsCategoryLoading(true);
    const limit = 100;

    // Use cached data instead of making new API call
    setTimeout(() => {
      const allData = categorySearchText.length >= 2
        ? (window as any).__searchCategories || []
        : (window as any).__allCategories || [];

      const nextBatch = allData.slice(categoryOffset, categoryOffset + limit);
      setSearchOptions((prev) => [...prev, ...nextBatch]);
      setCategoryOffset((prev) => prev + limit);
      setHasMoreCategories(categoryOffset + limit < allData.length);
      setIsCategoryLoading(false);
    }, 300); // Small delay to simulate loading
  }, [categoryOffset, categorySearchText, isCategoryLoading, hasMoreCategories]);

  if (isLoading) {
    return <OnboardingSummaryPlaceholder />;
  }

  return (
    <ComponentContainer className={classNames(styles.editableCardsContainer)}>
      <Text
        className={classNames(styles.summaryTitle)}
        type={TextTypes.heading3}
        fontWeight={FontWeights.bold}
        textAlign="center"
      >
        {__(WELCOME_TEXTS_STEP8, "beyondseo")}
      </Text>
      <ComponentContainer className={styles.businessInfoRow}>
        <ComponentContainer className={classNames(styles.editableCardWrapper, styles.businessInfoCard)}>
          <EditableCard
            className="editableCard"
            title={__("Business Information", "beyondseo")}
            editCallback={handleBusinessInfoEdit}
            hideEditButton={false}
            editButtonFloatRight={true}
            padding={true}
          >
            <ComponentContainer className={classNames(styles.businessInfoWrapper)}>
              <TextIcon icon={IconNames.tag}>{businessName}</TextIcon>
              {/* Domain */}
              <TextIcon icon={IconNames.browser}>{websiteUrl}</TextIcon>
            </ComponentContainer>
          </EditableCard>
        </ComponentContainer>
        <OnboardingSummaryAddress
          businessAddress={businessAddress}
          businessGeoAddress={businessGeoAddress}
          onAddressChange={handleAddressChange}
          isAddressDisabled={isAddressDisabled}
          prefillAddressRequirement={prefillAddressRequirement}
        />
      </ComponentContainer>

      <ComponentContainer className={classNames(styles.editableCardWrapper)}>
        <EditableCard
          className="editableCard"
          title={__("Website Description", "beyondseo")}
          editCallback={handleDescriptionEdit}
          hideEditButton={false}
          editButtonFloatRight={true}
          padding={true}
          actionBtns={
            websiteDescription?.trim() ? (
              <GeneratedWithAIPill text={__("Generated by us", "beyondseo")} />
            ) : undefined
          }
        >
          <ComponentContainer>
            {websiteDescription?.trim() ? (
              <Text type={TextTypes.text}>{websiteDescription}</Text>
            ) : (
              <div className={styles.empty}>
                <img className={classNames(styles.img)} src={emptyStateUfo} alt={__("loading...", "beyondseo")} />
                <Text type={TextTypes.textIntro} fontWeight={FontWeights.bold}>
                  {__("You don`t have any website description at the moment", "beyondseo")}
                </Text>
              </div>
            )}
          </ComponentContainer>
        </EditableCard>
      </ComponentContainer>

      <OnboardingSummaryKeyword keywords={keywords} setKeywords={setKeywords} />

      <ComponentContainer className={classNames(styles.editableCardWrapper)}>
        <EditableCard
          className="editableCard"
          title={__("Categories", "beyondseo")}
          editCallback={() => { }}
          hideEditButton={true}
          padding={true}
          editButtonFloatRight={true}
          actionBtns={
            categories.length > 0 ? <GeneratedWithAIPill text={__("Generated by us", "beyondseo")} /> : undefined
          }
        >
          <ComponentContainer className={styles.keywordInputContainer}>
            <div className={styles.autocompleteContainer}>
              <CategorySearchSelect
                searchText={categorySearchText}
                onSearchChange={handleCategorySearchChange}
                options={searchOptions}
                onSelection={handleCategorySelection}
                value={selectedCategoryId}
                isLoading={isCategoryLoading}
                placeholder={__("Search category eg.: Computer repair shop", "beyondseo")}
                onLoadMore={handleLoadMoreCategories}
                hasMore={hasMoreCategories}
                totalCount={categoryTotalCount}
              />
              {categoryError && (
                <Text type={TextTypes.textHelp} className={classNames(styles.errorTextCategories)}>
                  {categoryError}
                </Text>
              )}
            </div>
          </ComponentContainer>
          {categories.length > 0 ? (
            <TagList
              tags={categories.reduce((tags: TagProps[], element) => {
                tags.push({
                  id: element.id,
                  text: element.text,
                  hasDeleteBtn: true,
                  deleteBtnCallback: handleCategoryDelete,
                });
                return tags;
              }, [])}
            />
          ) : (
            <div className={styles.empty}>
              <img className={classNames(styles.img)} src={emptyStateUfo} alt="empty categories" />
              <Text type={TextTypes.textIntro} fontWeight={FontWeights.bold}>
                {__("You dont have any categories at the moment", "beyondseo")}
              </Text>
            </div>
          )}
        </EditableCard>
      </ComponentContainer>

      <ComponentContainer className={classNames(styles.blurredButtonContainer)}>
        <ComponentContainer
          className={classNames(VanguardStyle.dFlex, VanguardStyle.justifyContentEnd, VanguardStyle.gap8)}
        >
          <Button type={ButtonTypes.secondary} size={ButtonSizes.medium} onClick={onCancel} disabled={isFinishing}>
            {__("Cancel", "beyondseo")}
          </Button>
          <div>
            <Popover
              position={"right"}
              message={isFormValid() ? undefined : __(IS_FORM_VALID_POPOVER_MESSAGE, "beyondseo")}
            >
              <div>
                <Button
                  type={ButtonTypes.primary}
                  size={ButtonSizes.medium}
                  iconRight={IconNames.arrowRight}
                  onClick={handleFinish}
                  disabled={!isFormValid() || isFinishing}
                  isLoading={isLoading || isFinishing}
                >
                  {__("Finish Onboarding", "beyondseo")}
                </Button>
              </div>
            </Popover>
          </div>
        </ComponentContainer>
      </ComponentContainer>

      <div className={styles.bottomSpacer} />

      {showDescriptionModal && (
        <ComponentContainer className={styles.modalWrapper}>
          <EditModal
            title={__("Edit website description", "beyondseo")}
            close={() => setShowDescriptionModal(false)}
            closeOnSave={true}
            savable={true}
            saveCallback={handleDescriptionSave}
            cancelCallback={() => setShowDescriptionModal(false)}
            savingInProgress={false}
            width="528px"
            positiveBtnText={__("Save", "beyondseo")}
          >
            <Textarea
              value={tempDescription}
              onChange={(e: { target: { value: any; }; }) => {
                const value = e.target.value;
                setTempDescription(value);
                if (value.length > 750) {
                  setDescriptionError(__("Website description can have maximum 750 characters.", "beyondseo"));
                } else {
                  setDescriptionError("");
                }
              }}
              rows={6}
              minRows={2}
              placeholder={__("Enter website description", "beyondseo")}
              className={classNames(styles.modalTextarea, descriptionError ? styles.errorInput : "")}
              label={__("Website Description", "beyondseo")}
              required={true}
            />
            {descriptionError && (
              <Text type={TextTypes.textHelp} className={styles.errorText}>
                {descriptionError}
              </Text>
            )}
          </EditModal>
        </ComponentContainer>
      )}

      {showBusinessInfoModal && (
        <ComponentContainer className={styles.modalWrapper}>
          <EditModal
            title={__("Edit Business Information", "beyondseo")}
            close={() => setShowBusinessInfoModal(false)}
            closeOnSave={true}
            savable={true}
            saveCallback={handleBusinessInfoSave}
            cancelCallback={() => setShowBusinessInfoModal(false)}
            savingInProgress={false}
            width="528px"
            positiveBtnText={__("Save", "beyondseo")}
          >
            <Form className={styles.businessInfoForm}>
              <Input
                label={__("Business Name", "beyondseo")}
                required={true}
                value={tempBusinessName}
                onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => {
                  setTempBusinessName(e.target.value);
                  setBusinessNameError("");
                }}
                placeholder={__("Enter business name", "beyondseo")}
                className={classNames(businessNameError ? styles.errorInput : "")}
              />
              {businessNameError && (
                <Text type={TextTypes.textHelp} className={styles.businessNameErrorText}>
                  {businessNameError}
                </Text>
              )}
              <Input
                label={__("Website URL", "beyondseo")}
                required={true}
                value={websiteUrl}
                disabled={true}
                placeholder={__("Enter website URL", "beyondseo")}
              />
            </Form>
          </EditModal>
        </ComponentContainer>
      )}

      <ErrorModal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        errorMessage={errorMessage || __("Something went wrong from our side, please try again!", "beyondseo")}
        isLoading={isFinishing}
      />
    </ComponentContainer>
  );
};
