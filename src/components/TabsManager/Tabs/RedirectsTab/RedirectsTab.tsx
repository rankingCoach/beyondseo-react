import * as React from "react";
import styles from "./RedirectsTab.module.scss";
import tabStyles from "../Tabs.module.scss";
import {
  Button,
  ButtonSizes,
  ButtonTypes,
  ComponentContainer,
  FontWeights,
  Icon,
  IconNames,
  Input,
  Select,
  Switch,
  Text,
  TextTypes,
  VanguardStyle,
  TextIcon,
} from "vanguard";
import { useDispatch } from "react-redux";
import { SeoStore } from "@src/stores/swagger/rankingcoach/SeoStore";
import { RedirectsTabPlaceholder } from "./RedirectsTabPlaceholder";
import classNames from "classnames";
import { __ } from "@wordpress/i18n";

interface RedirectsTabProps {}

interface Redirect {
  id: string;
  source_uri: string;
  destination_url: string;
  redirect_code: string;
  active: string;
  hit_count: string;
  created_at: string;
  updated_at: string;
}

export const RedirectsTab: React.FC<RedirectsTabProps> = () => {
  const dispatch = useDispatch();
  const [redirects, setRedirects] = React.useState<Redirect[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Form inputs state
  const [sourceUrl, setSourceUrl] = React.useState<string>("");
  const [targetUrl, setTargetUrl] = React.useState<string>("");
  const [redirectType, setRedirectType] = React.useState<string>("301");
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);
  const [formError, setFormError] = React.useState<string | null>(null);
  const [formErrors, setFormErrors] = React.useState<{ [key: string]: string }>({});

  // Edit mode state
  const [editMode, setEditMode] = React.useState<boolean>(false);
  const [currentEditId, setCurrentEditId] = React.useState<string | null>(null);

  const handleAddOrUpdateRedirect = async () => {
    if (!sourceUrl || !targetUrl) {
      setFormError(__("Both Source URL and Target URL are required", "beyondseo"));
      return;
    }

    setIsSubmitting(true);
    setFormError(null);
    setFormErrors({});

    try {
      const requestBody = {
        source_uri: sourceUrl,
        destination_url: targetUrl,
        redirect_code: redirectType,
        active: "1",
      };

      if (editMode && currentEditId) {
        // Update existing redirect
        const updateResponse = (await dispatch(
          SeoStore.patchRankingcoachSeoRedirectManagerByIdThunk({
            id: parseInt(currentEditId),
            requestBody: {
              ...requestBody,
              id: currentEditId,
            },
          }),
        )) as any;

        if (updateResponse?.payload?.success) {
          setRedirects(
            redirects.map((item) => {
              if (item.id === currentEditId) {
                return {
                  ...item,
                  source_uri: sourceUrl,
                  destination_url: targetUrl,
                  redirect_code: redirectType,
                };
              }
              return item;
            }),
          );

          cancelEdit();
        } else {
          const errorPayload = updateResponse?.payload;
          if (errorPayload?.data?.params) {
            setFormErrors(errorPayload.data.params);
          }
          setFormError(errorPayload?.message || __("Failed to update redirect", "beyondseo"));
        }
      } else {
        const addResponse = (await dispatch(
          SeoStore.postRankingcoachSeoRedirectManagerThunk({
            requestBody: requestBody,
          }),
        )) as any;

        if (addResponse?.payload?.success) {
          // Fetch fresh data instead of manually constructing the redirect
          const response = (await dispatch(SeoStore.getRankingcoachSeoRedirectManagerThunk({}))) as any;
          if (response?.payload?.response?.redirects) {
            setRedirects(response.payload.response.redirects);
          }

          // Clear the form
          setSourceUrl("");
          setTargetUrl("");
          setRedirectType("301");
        } else {
          const errorPayload = addResponse?.payload;
          if (errorPayload?.data?.params) {
            setFormErrors(errorPayload.data.params);
          }
          setFormError(errorPayload?.message || __("Failed to add redirect", "beyondseo"));
        }
      }
    } catch (err) {
      setFormError(
        editMode
          ? __("An error occurred while updating the redirect", "beyondseo")
          : __("An error occurred while adding the redirect", "beyondseo"),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteRedirect = async (redirect: Redirect, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!redirect.id || redirect.id === "0") {
      return;
    }

    try {
      const response = (await dispatch(
        SeoStore.deleteRankingcoachSeoRedirectManagerByIdThunk({
          id: parseInt(redirect.id),
          requestBody: { id: redirect.id },
        }),
      )) as any;

      if (response?.payload?.success) {
        // Fetch fresh data instead of filtering locally
        const refreshResponse = (await dispatch(SeoStore.getRankingcoachSeoRedirectManagerThunk({}))) as any;
        if (refreshResponse?.payload?.response?.redirects) {
          setRedirects(refreshResponse.payload.response.redirects);
        }
      }
    } catch (err) {}
  };

  const handleStatusToggle = async (redirect: Redirect, isActive: boolean) => {
    try {
      setIsSubmitting(true);

      // Don't proceed if we don't have a valid ID
      if (!redirect.id || redirect.id === "0") {
        return;
      }

      const requestBody = {
        id: redirect.id,
        source_uri: redirect.source_uri,
        destination_url: redirect.destination_url,
        redirect_code: redirect.redirect_code,
        active: isActive ? "1" : "0",
      };

      const response = (await dispatch(
        SeoStore.patchRankingcoachSeoRedirectManagerByIdThunk({
          id: parseInt(redirect.id),
          requestBody: requestBody,
        }),
      )) as any;

      if (response?.payload?.success) {
        // Fetch fresh data instead of updating locally
        const refreshResponse = (await dispatch(SeoStore.getRankingcoachSeoRedirectManagerThunk({}))) as any;
        if (refreshResponse?.payload?.response?.redirects) {
          setRedirects(refreshResponse.payload.response.redirects);
        }
      }
    } catch (err) {
    } finally {
      setIsSubmitting(false);
    }
  };

  React.useEffect(() => {
    const fetchRedirects = async () => {
      try {
        setIsLoading(true);
        const response = (await dispatch(SeoStore.getRankingcoachSeoRedirectManagerThunk({}))) as any;

        if (response?.payload?.response?.redirects) {
          const redirectsData = response.payload.response.redirects;

          setRedirects(redirectsData);
        } else {
          setError(__("No redirects data found in the response", "beyondseo"));
        }
      } catch (err) {
        setError(__("Failed to load redirects data", "beyondseo"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchRedirects();
  }, [dispatch]);

  const handleEditClick = (redirect: Redirect) => {
    setSourceUrl(redirect.source_uri);
    setTargetUrl(redirect.destination_url);

    setRedirectType(redirect.redirect_code);

    setEditMode(true);
    setCurrentEditId(redirect.id);
    setFormError(null);
    setFormErrors({});

    document.querySelector(`.${styles.addRedirectFormContainer}`)?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  const cancelEdit = () => {
    setSourceUrl("");
    setTargetUrl("");
    setRedirectType("301");
    setEditMode(false);
    setCurrentEditId(null);
    setFormError(null);
    setFormErrors({});
  };

  const [redirectTypeOptions] = React.useState([
    { key: "301", value: "301", title: __("Permanent (301)", "beyondseo") },
    { key: "302", value: "302", title: __("Temporary (302)", "beyondseo") },
  ]);

  const getRedirectTypeDisplay = (type: string): string => {
    switch (type) {
      case "301":
        return __("Permanent", "beyondseo");
      case "302":
        return __("Temporary", "beyondseo");
      default:
        return type;
    }
  };

  if (error) {
    return (
      <div className={classNames(styles.redirectsContainer, VanguardStyle.mt3, VanguardStyle.mb3)}>
        <Text type={TextTypes.text} className={styles.tableTitle}>
          {__("Error:", "beyondseo")} {error}
        </Text>
      </div>
    );
  }

  return (
    <div className={classNames(styles.redirectsContainer, tabStyles.tabContent)}>
      {isLoading ? (
        <RedirectsTabPlaceholder />
      ) : (
        <>
          <div className={styles.header}>
            <div className={styles.infoBox}>
              <Text type={TextTypes.heading3} className={styles.infoTitle}>
                {__("Redirects Overview", "beyondseo")}
              </Text>
              <Text type={TextTypes.text} className={styles.infoDescription}>
                {__(
                  "Redirects help preserve your SEO rankings when URLs change or pages are removed. They ensure users and search engines are sent to the correct destination.",
                  "beyondseo",
                )}
              </Text>
              <div className={styles.usageGuide}>
                <Text type={TextTypes.text} className={styles.usageGuideTitle}>
                  {__("To create a redirect:", "beyondseo")}
                </Text>
                <ul className={styles.usageGuideList}>
                  <li>
                    <Text type={TextTypes.text}>
                      {__("Source URL should be a local path (e.g. /old-page)", "beyondseo")}
                    </Text>
                  </li>
                  <li>
                    <Text type={TextTypes.text}>
                      {__("Destination URL can be any full link (internal or external)", "beyondseo")}
                    </Text>
                  </li>
                </ul>
              </div>
              <Text type={TextTypes.text}>
                {__(
                  "Set up redirects to avoid broken links, retain link equity, and deliver a smoother experience to your visitors and search engines.",
                  "beyondseo",
                )}
              </Text>
            </div>
          </div>

          <Text type={TextTypes.text} className={styles.tableTitle} fontWeight={FontWeights.bold}>
            {__("Current redirects:", "beyondseo")}
          </Text>
          <div className={styles.tableContainer}>
            <table className={styles.redirectsTableContent}>
              <thead>
                <tr>
                  <th>
                    <Text type={TextTypes.textHelp} fontWeight={FontWeights.bold}>
                      {__("Source URL", "beyondseo")}
                    </Text>
                  </th>
                  <th>
                    <Text type={TextTypes.textHelp} fontWeight={FontWeights.bold}>
                      {__("Target URL", "beyondseo")}
                    </Text>
                  </th>
                  <th>
                    <Text type={TextTypes.textHelp} fontWeight={FontWeights.bold}>
                      {__("Type", "beyondseo")}
                    </Text>
                  </th>
                  <th>
                    <Text type={TextTypes.textHelp} fontWeight={FontWeights.bold}>
                      {__("Hits", "beyondseo")}
                    </Text>
                  </th>
                  <th>
                    <Text type={TextTypes.textHelp} fontWeight={FontWeights.bold}>
                      {__("Status", "beyondseo")}
                    </Text>
                  </th>
                  <th>
                    <Text type={TextTypes.textHelp} fontWeight={FontWeights.bold}>
                      {__("Actions", "beyondseo")}
                    </Text>
                  </th>
                </tr>
              </thead>
              <tbody>
                {redirects.length > 0 ? (
                  redirects.map((redirect, index) => (
                    <tr key={redirect.id || index}>
                      <td>{redirect.source_uri}</td>
                      <td>{redirect.destination_url}</td>
                      <td>{getRedirectTypeDisplay(redirect.redirect_code)}</td>
                      <td>{redirect.hit_count}</td>
                      <td className={styles.statusCell}>
                        <Switch
                          value={redirect.active === "1"}
                          size="small"
                          onChange={(e:any) => handleStatusToggle(redirect, (e.currentTarget as HTMLInputElement).checked)}
                          disabled={isSubmitting}
                        />
                      </td>
                      <td>
                        <div className={styles.actionButtons}>
                          <Button
                            iconLeft={IconNames.edit}
                            type={ButtonTypes.secondary}
                            size={ButtonSizes.small}
                            className={styles.editButton}
                            onClick={() => handleEditClick(redirect)}
                          />
                          <Button
                            iconLeft={IconNames.trash}
                            type={ButtonTypes.secondary}
                            size={ButtonSizes.small}
                            onClick={(e:any) => handleDeleteRedirect(redirect, e)}
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} style={{ textAlign: "center" }}>
                      {__("No redirects found. Use the form below to create one.", "beyondseo")}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <ComponentContainer className={styles.addRedirectFormContainer}>
            <Text type={TextTypes.text} className={styles.addRedirectTitle}>
              {editMode ? __("Update redirect:", "beyondseo") : __("Add new redirect:", "beyondseo")}
            </Text>

            <div className={styles.redirectInputsContainer}>
              <div className={styles.inputsRow}>
                <div className={styles.inputContainer}>
                  <Input
                    value={sourceUrl}
                    onChange={(e:any) => setSourceUrl(e.target.value)}
                    placeholder={__("Source URL (e.g., /old-page)", "beyondseo")}
                    className={styles.urlInput}
                    label={__("Source URL", "beyondseo")}
                    labelType="outer"
                    required={true}
                    textFieldProps={{
                      multiline: true,
                      rows: 1,
                    }}
                  />
                  {formErrors.source_uri && (
                    <Text type={TextTypes.text} color="--e500" className={styles.fieldError}>
                      {formErrors.source_uri}
                    </Text>
                  )}
                </div>

                <div className={styles.arrowIconContainer}>
                  <Icon children={IconNames.arrowRight} className={styles.arrowIcon} />
                </div>

                <div className={styles.inputContainer}>
                  <Input
                    value={targetUrl}
                    onChange={(e:any) => setTargetUrl(e.target.value)}
                    placeholder={__("Target URL (e.g., /new-page)", "beyondseo")}
                    className={styles.urlInput}
                    label={__("Target URL", "beyondseo")}
                    labelType="outer"
                    required={true}
                    textFieldProps={{
                      multiline: true,
                      rows: 1,
                    }}
                  />
                  {formErrors.destination_url && (
                    <Text type={TextTypes.text} color="--e500" className={styles.fieldError}>
                      {formErrors.destination_url}
                    </Text>
                  )}
                </div>
              </div>

              <div className={styles.selectRow}>
                <Select
                  required={true}
                  value={redirectType}
                  onChange={(e:any) => setRedirectType(e.target.value)}
                  options={redirectTypeOptions}
                  label={__("Redirect type", "beyondseo")}
                  className={styles.redirectTypeSelect}
                />
                <div className={styles.redirectTypeInfo}>
                  <div className={styles.redirectTypeItem}>
                    <TextIcon
                      icon={IconNames.refresh}
                      iconColor="--p500"
                      textType={TextTypes.text}
                      fontWeight={FontWeights.bold}
                    >
                      {__("301 – Permanent Redirect", "beyondseo")}
                    </TextIcon>
                    <Text type={TextTypes.text} className={styles.redirectTypeDescription}>
                      {__("Best for SEO. Use when a page is moved or replaced permanently.", "beyondseo")}
                    </Text>
                  </div>
                  <div className={styles.redirectTypeItem}>
                    <TextIcon
                      icon={IconNames.clock}
                      iconColor="--p500"
                      textType={TextTypes.text}
                      fontWeight={FontWeights.bold}
                    >
                      {__("302 – Temporary Redirect", "beyondseo")}
                    </TextIcon>
                    <Text type={TextTypes.text} className={styles.redirectTypeDescription}>
                      {__(
                        "Use when the original page will come back, like during maintenance or testing.",
                        "beyondseo",
                      )}
                    </Text>
                  </div>
                </div>
              </div>

              {formError && (
                <Text type={TextTypes.text} color="--e500">
                  {formError}
                </Text>
              )}

              <div className={styles.buttonRow}>
                <Button onClick={handleAddOrUpdateRedirect} isLoading={isSubmitting}>
                  {editMode ? __("Update Redirect", "beyondseo") : __("Add Redirect", "beyondseo")}
                </Button>

                {editMode && (
                  <Button onClick={cancelEdit} type={ButtonTypes.secondary}>
                    {__("Cancel", "beyondseo")}
                  </Button>
                )}
              </div>
            </div>
          </ComponentContainer>
        </>
      )}
    </div>
  );
};
