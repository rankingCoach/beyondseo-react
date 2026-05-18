import React from 'react';
import {
    Button,
    ButtonTypes,
    ButtonSizes,
    Text,
    TextTypes,
    FontWeights,
    classNames,
    Icon,
    IconNames,
    IconSize,
} from 'vanguard';
import styles from './LaunchOfferUpsell.module.scss';
import {
    launchOfferConfig,
    type LaunchOfferConfig,
    type LaunchOfferPlan,
    type LaunchOfferFeature,
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
    const spotsFilled = Math.max(0, Math.min(100, config.spotsFilledPercent));

    const handleAnnualClick = (event: React.MouseEvent<HTMLElement>) => onUpgrade('annual', event);
    const handleMonthlyClick = (event: React.MouseEvent<HTMLElement>) => onUpgrade('monthly', event);
    const handleMonthlyKey = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onUpgrade('monthly', event as unknown as React.MouseEvent<HTMLElement>);
        }
    };

    return (
        <div className={styles.launchOffer} id={scrollId ?? undefined}>
            <div className={styles.header}>
                <Text type={TextTypes.heading2} fontWeight={FontWeights.bold} className={styles.title}>
                    {config.title}
                </Text>
                <Text type={TextTypes.text} className={styles.subtitle}>
                    {config.subtitle}
                </Text>
            </div>

            <div className={styles.card}>
                <div className={styles.spotsBanner}>
                    <div className={styles.spotsHeader}>
                        <span className={styles.spotsTitle}>
                            <span role="img" aria-label="fire">🔥</span>
                            {config.spotsBadge}
                        </span>
                        <span className={styles.spotsLimit}>{config.spotsLimit}</span>
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
                        {config.spotsDescription}
                    </Text>
                </div>

                <div className={styles.pricingComparison}>
                    {renderPlanCard(config.founders, true)}
                    <div
                        role="button"
                        tabIndex={isLoading ? -1 : 0}
                        aria-disabled={isLoading}
                        className={classNames(
                            styles.priceCard,
                            styles.priceCardInactive,
                            isLoading ? styles.priceCardDisabled : '',
                        )}
                        onClick={isLoading ? undefined : handleMonthlyClick}
                        onKeyDown={isLoading ? undefined : handleMonthlyKey}
                    >
                        {renderPlanContent(config.alternative)}
                    </div>
                </div>

                <ul className={styles.featuresList}>
                    {config.features.map((feature: LaunchOfferFeature, index: number) => (
                        <li key={index} className={styles.featureItem}>
                            <span className={styles.featureIcon}>
                                <Icon type={IconSize.small} color="#2bb673">{IconNames.check}</Icon>
                            </span>
                            <span>{feature.text}</span>
                        </li>
                    ))}
                </ul>

                <Button
                    type={ButtonTypes.primary}
                    size={ButtonSizes.medium}
                    className={styles.ctaButton}
                    iconRight={IconNames.arrowRight}
                    onClick={handleAnnualClick}
                    isLoading={isLoading}
                    disabled={isLoading}
                >
                    {config.ctaLabel}
                </Button>

                <Text type={TextTypes.text} className={styles.ctaFootnote}>
                    {config.ctaFootnote}
                </Text>
            </div>
        </div>
    );
};

const renderPlanCard = (plan: LaunchOfferPlan, isActive: boolean) => (
    <div className={classNames(styles.priceCard, isActive ? styles.priceCardActive : styles.priceCardInactive)}>
        {renderPlanContent(plan)}
    </div>
);

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
