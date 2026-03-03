import * as React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { classNames, ComponentContainer, EditableCard, IconNames, TextIcon, TextTypes, Button, ButtonTypes, ButtonSizes } from "vanguard";
import { __ } from "@wordpress/i18n";
import styles from "./OnboardingSummary.module.scss";
import addressStyles from "./OnboardingSummaryAddress.module.scss";
import { rcWindow } from "@stores/window.store";
import { hasRooftopPrecision } from "@helpers/geo-helpers";

const MOBILE_BREAKPOINT = 782;
const IFRAME_MAP_URL = (rcWindow.rankingCoachReactData?.iframeMapUrl || "");

interface OnboardingSummaryAddressProps {
  businessAddress: string;
  businessGeoAddress?: string;
  onAddressChange: (formattedAddress: string, geoAddress: string) => void;
  isAddressDisabled: boolean;
  prefillAddressRequirement?: boolean;
}

export const OnboardingSummaryAddress: React.FC<OnboardingSummaryAddressProps> = ({
  businessAddress,
  businessGeoAddress,
  onAddressChange,
  prefillAddressRequirement = false
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [showBusinessAddressIframe, setShowBusinessAddressIframe] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const isMobile = useIsMobile();

  const iframeUrlWithParams = useMemo(() => {
    let lat = '';
    let lng = '';
    let cleanedAddress = businessAddress || "";
    // let countryShortCode = '';

    if (businessGeoAddress) {
      try {
        const geoData = JSON.parse(businessGeoAddress);
        lat = geoData.geoPoint?.lat || '';
        lng = geoData.geoPoint?.lng || '';

        // Remove country name from the end if it exists
        const countryName = geoData.country?.name;
        if (countryName && cleanedAddress.endsWith(countryName)) {
          cleanedAddress = cleanedAddress.slice(0, -countryName.length);
        }

        // Trim whitespace and remove trailing commas
        cleanedAddress = cleanedAddress.trim().replace(/,+$/, "");

        // countryShortCode = geoData.country?.shortCode;
      } catch (error) {
      }
    }

    // Always use countryShortCode from WordPress locale
    const countryShortCode = rcWindow.rankingCoachReactData?.countryShortCode || '';

    const outer = new URL(IFRAME_MAP_URL);

    const innerRaw = outer.searchParams.get("redirect_url")!;
    const inner = new URL(innerRaw);

    inner.searchParams.set("businessAddress", cleanedAddress);
    // Always set countryShortCode from WordPress locale
    if (countryShortCode) {
      inner.searchParams.set("countryShortCode", countryShortCode);
    }
    if (lat && lng) {
      inner.searchParams.set("lat", lat);
      inner.searchParams.set("lng", lng);
    }

    outer.searchParams.set("redirect_url", inner.toString());

    const finalUrl = outer.toString();

    return finalUrl;
  }, [businessAddress, businessGeoAddress]);

  const iframeOrigin = useMemo(() => new URL(IFRAME_MAP_URL).origin, [IFRAME_MAP_URL]);

  const handleIframeOpen = () => {
    setShowBusinessAddressIframe(true);
  };

  const handleIframeClose = (formattedAddress?: string, geoAddress?: string) => {
    if (!!formattedAddress && !!geoAddress) {
      onAddressChange(formattedAddress, geoAddress);
    }

    setShowBusinessAddressIframe(false);
  };

  const handleModalClick = (e: React.MouseEvent) => {
    // Close modal when clicking on the backdrop or iframe container padding
    const target = e.target as HTMLElement;
    const isModalWrapper = e.target === e.currentTarget;
    const isIframeContainer = target.classList.contains(addressStyles.iframeContainer);

    if (isModalWrapper || isIframeContainer) {
      handleIframeClose();
    }
  };

  useEffect(() => {
    if (!showBusinessAddressIframe) return;

    const onMessage = (e: MessageEvent) => {
      if (e.origin !== iframeOrigin) return;

      if (e.data?.type === "BUSINESS_ADDRESS_UPDATED") {
        const updated = e.data?.payload ?? "";
        handleIframeClose(updated.formattedAddress, updated.geoCodeRawResults);
      }
    };

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [showBusinessAddressIframe, iframeOrigin]);



  // Keep state in sync with WP body class changes
  useEffect(() => {
    const body = document.body;

    const updateFromBody = () => {
      // WP adds 'folded' when the menu is collapsed
      setSidebarOpen(!body.classList.contains("folded"));
    };

    updateFromBody();

    const obs = new MutationObserver(updateFromBody);
    obs.observe(body, { attributes: true, attributeFilter: ["class"] });

    // Also listen to clicks on the collapse button (optional redundancy)
    const btn = document.getElementById("collapse-button");
    const onClick = () => {
      // aria-expanded = "true" means open
      const expanded = btn?.getAttribute("aria-expanded") !== "false";
      setSidebarOpen(expanded);
    };
    btn?.addEventListener("click", onClick);

    return () => {
      obs.disconnect();
      btn?.removeEventListener("click", onClick);
    };
  }, []);

  // Compute the width based on menu state (160 when open, 36 when collapsed)
  const containerStyle = useMemo(() => {
    const sidebar = isMobile ? 0 : (sidebarOpen ? 160 : 36);

    return {
      paddingLeft: `${sidebar}px`,
    } as React.CSSProperties;
  }, [sidebarOpen, isMobile]);

  return (
    <>
      <ComponentContainer className={classNames(styles.editableCardWrapper, addressStyles.businessAddressCard)}>
        <EditableCard
          className="editableCard"
          title={__("Business Address", "beyondseo")}
          editCallback={handleIframeOpen}
          hideEditButton={false}
          editButtonFloatRight={true}
          padding={true}
        >
          {prefillAddressRequirement ? (
            <ComponentContainer className={classNames(addressStyles.centeredContent)}>
              <Button
                type={ButtonTypes.secondary}
                size={ButtonSizes.medium}
                iconRight={IconNames.arrowRight}
                onClick={handleIframeOpen}
              >
                {__("Update Address", "beyondseo")}
              </Button>
            </ComponentContainer>
          ) : (
              <ComponentContainer>
                <TextIcon icon={IconNames.location}>{businessAddress}</TextIcon>
              </ComponentContainer>
          )}
          <ComponentContainer className={classNames(addressStyles.errorWrapper)}>
            {!hasRooftopPrecision(businessGeoAddress ?? "") && (
              <TextIcon
                textColor={"--e500"}
                icon={IconNames.exclamation}
                iconColor={"--e500"}
                iconHasCircle={true}
                textType={TextTypes.textHelp}
              >
                {__("Address is not precise enough, please confirm your location on the map.", "beyondseo")}
              </TextIcon>
            )}
          </ComponentContainer>
        </EditableCard>
      </ComponentContainer>

      {showBusinessAddressIframe && (
        <ComponentContainer className={styles.modalWrapper} onClick={handleModalClick}>
            <div className={addressStyles.iframeContainer} style={containerStyle}>
              <iframe
                ref={iframeRef}
                src={iframeUrlWithParams}
                title={__("Edit business address", "beyondseo")}
                className={addressStyles.businessAddressIframe}
              />
            </div>
        </ComponentContainer>
      )}
    </>
  );
};

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`);
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    // Safari fallback
    mq.addListener?.(update);
    return () => {
      mq.removeEventListener?.("change", update);
      mq.removeListener?.(update);
    };
  }, []);

  return isMobile;
}

