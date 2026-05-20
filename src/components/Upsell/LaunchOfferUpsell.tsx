import React, { useState } from 'react';
import {
    Button,
    ButtonTypes,
    ButtonSizes,
    Text,
    TextTypes,
    classNames,
    Icon,
    IconNames,
    IconSize,
} from 'vanguard';
import { rcWindow } from "@stores/window.store";
import styles from './LaunchOfferUpsell.module.scss';
import flameSvg from './img/Flame.svg';
import {
    applyUpgradablePlansToLaunchOfferConfig,
    launchOfferConfig,
    type LaunchOfferConfig,
    type LaunchOfferPlan,
    type LaunchOfferFeature,
    type UpgradablePlans,
} from './upsellConfig';

export const LAUNCH_OFFER_SCROLL_ID = 'wp-launch-offer';

type LaunchPaymentType = 'annual' | 'monthly';

type LaunchOfferUpsellProps = {
    onUpgrade: (paymentType: LaunchPaymentType, event: React.MouseEvent<HTMLElement>) => void;
    isLoading?: boolean;
    config?: LaunchOfferConfig;
    /**
     * Anchor id used to scroll the page to this component. Defaults to LAUNCH_OFFER_SCROLL_ID.
     * Pass `null` to opt out (useful when the same component is rendered twice on the page).
     */
    scrollId?: string | null;
};

export const LaunchOfferUpsell: React.FC<LaunchOfferUpsellProps> = ({
    onUpgrade,
    isLoading = false,
    config = launchOfferConfig,
    scrollId = LAUNCH_OFFER_SCROLL_ID,
}) => {
    const [selectedPlan, setSelectedPlan] = useState<LaunchPaymentType>('annual');

    const upgradablePlans: UpgradablePlans | null | undefined =
        rcWindow?.rankingCoachReactData?.upgradablePlans;
    const resolvedConfig = applyUpgradablePlansToLaunchOfferConfig(config, upgradablePlans);
    const spotsFilled = Math.max(0, Math.min(100, resolvedConfig.spotsFilledPercent));

    const isAnnualActive = selectedPlan === 'annual';

    const handleCtaClick = (event: React.MouseEvent<HTMLElement>) => onUpgrade(selectedPlan, event);

    const handleAnnualCardClick = () => { if (!isAnnualActive) setSelectedPlan('annual'); };
    const handleMonthlyCardClick = () => { if (isAnnualActive) setSelectedPlan('monthly'); };

    const handleAnnualCardKey = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if ((event.key === 'Enter' || event.key === ' ') && !isAnnualActive) {
            event.preventDefault();
            setSelectedPlan('annual');
        }
    };
    const handleMonthlyCardKey = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if ((event.key === 'Enter' || event.key === ' ') && isAnnualActive) {
            event.preventDefault();
            setSelectedPlan('monthly');
        }
    };

    const monthlyCtaLabel = `Start for ${resolvedConfig.alternative.price}${resolvedConfig.alternative.pricePeriod}`;
    const ctaLabel = isAnnualActive ? resolvedConfig.ctaLabel : monthlyCtaLabel;

    return (
        <div className={styles.launchOffer} id={scrollId ?? undefined}>
            <div className={styles.card}>
                <div className={styles.gradientHeader}>
                    <img src={flameSvg} alt="" aria-hidden="true" className={styles.flameDecoration} />
                    <div className={styles.spotsHeader}>
                        <span className={styles.spotsTitle}>{resolvedConfig.spotsBadge}</span>
                        <span className={styles.spotsLimit}>{resolvedConfig.spotsLimit}</span>
                    </div>
                    <div
                        className={styles.progressBar}
                        role="progressbar"
                        aria-valuenow={spotsFilled}
                        aria-valuemin={0}
                        aria-valuemax={100}
                    >
                        <div className={styles.progressFill} style={{ width: `${spotsFilled}%` }} />
                    </div>
                    <Text type={TextTypes.text} className={styles.spotsDescription}>
                        {resolvedConfig.spotsDescription}
                    </Text>
                </div>

                <div className={styles.cardBody}>
                    <div className={styles.pricingComparison}>
                        <div
                            role={isAnnualActive ? undefined : 'button'}
                            tabIndex={isAnnualActive ? undefined : (isLoading ? -1 : 0)}
                            aria-disabled={isAnnualActive ? undefined : isLoading}
                            className={classNames(
                                styles.priceCard,
                                isAnnualActive ? styles.priceCardActive : styles.priceCardInactive,
                                !isAnnualActive && isLoading ? styles.priceCardDisabled : '',
                            )}
                            onClick={!isAnnualActive && !isLoading ? handleAnnualCardClick : undefined}
                            onKeyDown={!isAnnualActive && !isLoading ? handleAnnualCardKey : undefined}
                        >
                            {renderPlanContent(resolvedConfig.founders)}
                        </div>
                        <div
                            role={isAnnualActive ? 'button' : undefined}
                            tabIndex={isAnnualActive ? (isLoading ? -1 : 0) : undefined}
                            aria-disabled={isAnnualActive ? isLoading : undefined}
                            className={classNames(
                                styles.priceCard,
                                isAnnualActive ? styles.priceCardInactive : styles.priceCardActive,
                                isAnnualActive && isLoading ? styles.priceCardDisabled : '',
                            )}
                            onClick={isAnnualActive && !isLoading ? handleMonthlyCardClick : undefined}
                            onKeyDown={isAnnualActive && !isLoading ? handleMonthlyCardKey : undefined}
                        >
                            {renderPlanContent(resolvedConfig.alternative)}
                        </div>
                    </div>

                    <ul className={styles.featuresList}>
                        {resolvedConfig.features.map((feature: LaunchOfferFeature, index: number) => (
                            <li key={index} className={styles.featureItem}>
                                <span className={styles.featureIcon}>
                                    <Icon type={IconSize.small} color="var(--s900)">{IconNames.check}</Icon>
                                </span>
                                <span>{feature.text}</span>
                            </li>
                        ))}
                    </ul>

                    <Button
                        type={ButtonTypes.primary}
                        size={ButtonSizes.medium}
                        className={styles.ctaButton}
                        onClick={handleCtaClick}
                        isLoading={isLoading}
                        disabled={isLoading}
                    >
                        {ctaLabel}
                    </Button>

                    <Text type={TextTypes.text} className={styles.ctaFootnote}>
                        {resolvedConfig.ctaFootnote}
                    </Text>
                </div>
            </div>
        </div>
    );
};

const renderPlanContent = (plan: LaunchOfferPlan) => (
    <>
        {plan.badge && <span className={styles.foundersBadge}>{plan.badge}</span>}
        <div className={styles.priceLabel}>{plan.label}</div>
        <div className={styles.priceMain}>
            <span className={styles.priceAmount}>{plan.price}</span>
            <span className={styles.pricePeriod}>{plan.pricePeriod}</span>
        </div>
        {plan.primarySubtext && (
            <div className={styles.priceSubtext}>{plan.primarySubtext}</div>
        )}
        {plan.strikethroughSubtext && (
            <div className={styles.priceCompare}>
                vs. <s>{plan.strikethroughSubtext}</s>
                {plan.secondarySubtext ? ` ${plan.secondarySubtext}` : ''}
            </div>
        )}
        {plan.highlightText && (
            <div
                className={classNames(
                    styles.priceHighlight,
                    plan.highlightType === 'negative'
                        ? styles.priceHighlightNegative
                        : styles.priceHighlightPositive,
                )}
            >
                {plan.highlightText}
            </div>
        )}
    </>
);
