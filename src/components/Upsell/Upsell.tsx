import React, { useState } from 'react';
import { Button, ButtonTypes, ButtonSizes, Text, TextTypes, FontWeights, Switch, classNames, Icon, IconNames, IconSize } from 'vanguard';
import { __ } from '@wordpress/i18n';
import styles from './Upsell.module.scss';
import { rcWindow } from "@stores/window.store";
import gradientBackground from "@assets/upsell-page/gradient-background.svg";
import aiBadges from "@assets/upsell-page/ai-badges.svg";
import aiSparksBackgroundHorizontal from "@assets/upsell-page/ai-sparks-background-horizontal.svg";
// TODO: replace with correct background image, svg. This is temporary png solution, which has HUGE size.
import simpleQuoteCharacter from "@assets/upsell-page/simple-quote-character.svg";
import reviewsioLogo from "@assets/upsell-page/reviewsio-logo.svg";
import { RotatingWord } from "@components/Common/RotatingWord/RotatingWord";
import { ContactSalesModal } from './ContactSalesModal';

import {
    defaultExpandedCategoryIds,
    featureCategories,
    featureHighlights,
    impactMetrics,
    stats,
    testimonials
} from './upsellConfig';
import type {
    StatusValue,
    FeatureCategory,
    FeatureRow,
    Stat,
    ImpactMetric,
    Testimonial,
    ProfessionalCard,
    FeatureHighlight,
    PlanFeature
} from './upsellConfig';

// Type declaration for the global BSEORegistration object
declare global {
    interface Window {
        BSEORegistration?: {
            init: (config?: any) => void;
            openRegistrationWindow: (event: React.MouseEvent<HTMLButtonElement>) => void;
            openWindow: (url: string) => void;
            openLoadingWindow: () => boolean;
            navigateWindow: (url: string) => void;
            closeWindow: () => void;
        };
        rcUpsell?: {
            apiUrl: string;
            baseUrl: string;
            locale: string;
            nonce: string;
        };
    }
}

/**
 * Generate a cryptographically secure session ID
 * @returns {string} UUID v4 session identifier
 */
function generateSessionId() {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    // Fallback for older browsers
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

/**
 * Get current origin for parent identification
 * @returns {string} Current window origin
 */
function getCurrentOrigin() {
    return window.location.origin;
}

export const Upsell = () => {
    const isOnboardingCompleted = rcWindow?.rankingCoachReactData?.isOnboardingCompleted !== "false";
    const [paymentPeriod, setPaymentPeriod] = useState<'monthly' | 'annual'>('annual');
    const [isLoading, setIsLoading] = useState(false);
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);
    const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>(() =>
        featureCategories.reduce((acc: Record<string, boolean>, category: FeatureCategory) => {
            acc[category.id] = defaultExpandedCategoryIds.includes(category.id);
            return acc;
        }, {} as Record<string, boolean>)
    );
    const renderStatus = (status: StatusValue) => {
        if (status.type === 'check') {
            return (
                <span className={classNames(styles.statusIcon, styles.statusPositive)}>
                    <Icon type={IconSize.small} color="#2bb673" hasCircle fillColor="#e9f7ef">{IconNames.check}</Icon>
                </span>
            );
        }

        if (status.type === 'cross') {
            return (
                <span className={classNames(styles.statusIcon, styles.statusNegative)}>
                    <Icon type={IconSize.small} color="#d14b4b" hasCircle fillColor="#ffefef">{IconNames.close}</Icon>
                </span>
            );
        }

        if (status.type === 'limited') {
            return <span className={styles.limitedTag}>{status.label || __('Limited', 'beyondseo')}</span>;
        }

        return (
            <Text type={TextTypes.text} className={styles.statusText} fontWeight={FontWeights.bold}>
                {status.label}
            </Text>
        );
    };

    const toggleCategory = (categoryId: string) => {
        setExpandedCategories(prev => ({
            ...prev,
            [categoryId]: !prev[categoryId]
        }));
    };

    /**
     * Handle redirect to registration page when onboarding is not completed
     */
    const handleActivateForFree = () => {
        const adminUrl = rcWindow?.rankingCoachReactData?.adminurl;
        window.location.href = `${adminUrl}?page=rankingcoach-onboarding`;
    };

    /**
     * Handle the upgrade button click by calling the global registration window handler
     */
    const handleUpgradeClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();

        if (!window.rcUpsell || !window.BSEORegistration) {
            console.error('[React] Required globals missing');
            alert('System not fully loaded. Please refresh.');
            return;
        }

        // Open loading window immediately to prevent popup blockers
        let windowOpened = false;
        if (window.BSEORegistration.openLoadingWindow) {
            windowOpened = window.BSEORegistration.openLoadingWindow();
            if (!windowOpened) {
                // Popup was blocked and handled by the library
                return;
            }
        }

        setIsLoading(true);

        try {
            const response = await fetch(window.rcUpsell.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-WP-Nonce': window.rcUpsell.nonce
                },
                body: JSON.stringify({
                    paymentType: paymentPeriod
                })
            });

            const data = await response.json();

            // data.registrationURL is relative to the root
            if (data.registrationURL) {
                const url = new URL(window.rcUpsell.baseUrl + data.registrationURL);
                const autoClose = 1;

                if (data.s) {
                    url.searchParams.set('s', data.s);
                }
                url.searchParams.set('sessionId', generateSessionId());
                url.searchParams.set('parentOrigin', getCurrentOrigin());
                url.searchParams.set('autoClose', String(Number(autoClose)));

                const fullRegistrationURL = url.toString().replace('&amp;', '&').replace('?&', '?');
                let finalUrl = fullRegistrationURL;

                if (data.voucherURL) {
                    const voucherUrlObj = new URL(window.rcUpsell.baseUrl + '/' + window.rcUpsell.locale + data.voucherURL);
                    voucherUrlObj.searchParams.set('redirecturl', fullRegistrationURL);
                    finalUrl = voucherUrlObj.toString();
                }

                if (windowOpened && window.BSEORegistration.navigateWindow) {
                    window.BSEORegistration.navigateWindow(finalUrl);
                } else {
                    window.BSEORegistration.openWindow(finalUrl);
                }
            } else {
                throw new Error(data.message || 'Failed to get upsell URL');
            }
        } catch (error) {
            console.error('[React] Upsell error:', error);
            alert('Could not start upgrade process. Please try again.');

            if (windowOpened && window.BSEORegistration.closeWindow) {
                window.BSEORegistration.closeWindow();
            }
        } finally {
            setIsLoading(false);
        }
    };

    const togglePaymentPeriod = () => {
        setPaymentPeriod(prev => prev === 'annual' ? 'monthly' : 'annual');
    };
    const openContactModal = () => {
        setIsContactModalOpen(true);
    };

    return (
        <div className={styles.upsellPage}>
            {/* Hero Section */}
            <div
                className={styles.hero}
                style={{
                    backgroundImage: `url(${gradientBackground})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'top center',
                    backgroundRepeat: 'no-repeat'
                }}
            >
                {isOnboardingCompleted && (
                    <div className={styles.limitedOfferBadge}>
                        <span role="img" aria-label="party">🎉</span> {__('Limited Offer: First 3 months only $5/month!', 'beyondseo')}
                    </div>
                )}

                <div className={styles.heroTitle}>
                    <h1 style={{
                        color: 'white',
                        fontSize: 'inherit',
                        fontWeight: 'inherit',
                        lineHeight: 'inherit',
                        margin: 0
                    }}>
                        {__('Your ', 'beyondseo')}
                        <RotatingWord
                            words={[
                                __('business', 'beyondseo'),
                                __('SEO', 'beyondseo'),
                                __('website', 'beyondseo'),
                                __('GEO', 'beyondseo'),
                                __('reputation', 'beyondseo'),
                                __('social media', 'beyondseo'),
                            ]}
                        />
                        {__(' deserves', 'beyondseo')}
                    </h1>

                    <Text type={TextTypes.heading1} fontWeight={FontWeights.bold}>
                        <mark>{__('its full potential', 'beyondseo')}</mark>
                    </Text>
                </div>

                <Text type={TextTypes.text} className={styles.heroSubtitle}>
                    {__('Connect now to get rankingCoach Radar to access all features in your SEO, Online Presence, Social, and Reputation blocks, as well as new ones.', 'beyondseo')}
                </Text>

                <Button
                    type={ButtonTypes.secondary}
                    size={ButtonSizes.medium}
                    className={styles.heroButton}
                    onClick={isOnboardingCompleted ? handleUpgradeClick : handleActivateForFree}
                    isLoading={isOnboardingCompleted ? isLoading : false}
                    disabled={isOnboardingCompleted ? isLoading : false}
                >
                    {isOnboardingCompleted
                        ? __('Upgrade to rankingCoach 360 now', 'beyondseo')
                        : __('Connect for free', 'beyondseo')
                    }
                </Button>

                {isOnboardingCompleted && (
                    <>
                        <div className={styles.periodSwitcher}>
                            <span
                                className={classNames(styles.periodLabel, paymentPeriod === 'monthly' ? styles.periodLabelActive : '')}
                                onClick={() => setPaymentPeriod('monthly')}
                            >
                                {__('Monthly', 'beyondseo')}
                            </span>
                            <Switch
                                value={paymentPeriod === 'annual'}
                                onChange={togglePaymentPeriod}
                                size="small"
                            />
                            <span
                                className={classNames(styles.periodLabel, paymentPeriod === 'annual' ? styles.periodLabelActive : '')}
                                onClick={() => setPaymentPeriod('annual')}
                            >
                                {__('Annual', 'beyondseo')}
                            </span>
                        </div>
                        <div className={styles.paymentInfo}>
                            {paymentPeriod === 'annual'
                                ? __('* Annual payment', 'beyondseo')
                                : __('* Monthly payment', 'beyondseo')
                            }
                        </div>
                    </>
                )}

                <div className={styles.trustIndicators}>
                    <span className={styles.trustIndicator}>
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Icon key={i} type={IconSize.small} color="#FFB114">
                                {IconNames.starActive}
                            </Icon>
                        ))}
                        <span>4.84/5 | 5,000+ Reviews</span>
                    </span>
                    <span>Google Partner</span>
                </div>

                <div className={styles.statsGrid}>
                    {stats.map((stat: Stat, index: number) => (
                        <div key={index} className={styles.statCard}>
                            <div className={styles.statLabel}>{stat.label}</div>
                            <div className={styles.statValue}>{stat.value}</div>
                            <div className={styles.statChange}>
                                <span>↑</span> {stat.change}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Foundation Section */}
            <div className={styles.foundationSection}>
                <div className={styles.foundationTitle}>
                    <Text type={TextTypes.heading2} fontWeight={FontWeights.bold} className={styles.foundationLinePrimary}>
                        {__('You\'ve laid the foundation.', 'beyondseo')}
                    </Text>
                    <Text type={TextTypes.heading2} fontWeight={FontWeights.bold} className={styles.foundationLineSecondary}>
                        {__('Now let\'s take it further.', 'beyondseo')}
                    </Text>
                </div>
                <Text type={TextTypes.text} className={styles.foundationSubtitle}>
                    {__('The free rankingCoach Radar plugin is a great start. To continue growing your business, you need the full power.', 'beyondseo')}
                </Text>

            </div>

            {/* Feature Comparison Section */}
            <section className={styles.comparisonSection}>
                <div className={styles.comparisonContainer}>
                    <div className={styles.comparisonHeader}>
                        <Text type={TextTypes.heading2} fontWeight={FontWeights.regular}>
                            {__('What you get with free rankingCoach Radar', 'beyondseo')}
                        </Text>
                    </div>

                    <div className={styles.comparisonCard}>
                        <div className={styles.tableHeader}>
                            <Text type={TextTypes.text} fontWeight={FontWeights.regular} className={styles.headerCell}>
                                {__('Feature', 'beyondseo')}
                            </Text>
                            <Text type={TextTypes.text} fontWeight={FontWeights.regular} className={classNames(styles.headerCell, styles.headerCellCenter)}>
                                {__('RankingCoach Radar', 'beyondseo')}
                            </Text>
                        </div>

                        {featureCategories.map((category: FeatureCategory) => {
                            const isExpanded = expandedCategories[category.id];

                            return (
                                <div key={category.id} className={styles.categoryBlock}>
                                    <button
                                        type="button"
                                        className={classNames(styles.summaryRow, isExpanded ? styles.summaryRowOpen : '')}
                                        aria-expanded={isExpanded}
                                        aria-controls={`feature-${category.id}`}
                                        onClick={() => toggleCategory(category.id)}
                                    >
                                        <div className={classNames(styles.cell, styles.featureTitleCell, styles.summaryLeft)}>
                                            <Text type={TextTypes.text} fontWeight={FontWeights.medium} className={styles.summaryTitle} color="--n700">
                                                {category.title}
                                            </Text>
                                            <span className={styles.summaryCaret} aria-hidden="true" />
                                        </div>
                                        <div className={classNames(styles.cell, styles.statusCell)}>
                                            {renderStatus(category.radar)}
                                        </div>
                                    </button>

                                    {isExpanded && category.rows.length > 0 && (
                                        <div className={styles.detailsWrapper} id={`feature-${category.id}`}>
                                            {category.rows.map((row: FeatureRow, rowIndex: number) => (
                                                <div className={classNames(styles.row, styles.detailRow)} key={rowIndex}>
                                                    <div className={classNames(styles.cell, styles.detailLabel)}>
                                                        <Text type={TextTypes.text} fontWeight={FontWeights.regular} color="--n700">
                                                            {row.label}
                                                        </Text>
                                                    </div>
                                                    <div className={classNames(styles.cell, styles.statusCell)}>
                                                        {renderStatus(row.radar)}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                        <div className={styles.legendRow}>
                            <div className={styles.legendItem}>
                                <Icon type={IconSize.small} color="#2bb673" hasCircle fillColor="#e9f7ef">{IconNames.check}</Icon>
                                <Text type={TextTypes.text} className={styles.legendText}>{__('Full access', 'beyondseo')}</Text>
                            </div>
                            <div className={styles.legendItem}>
                                <Icon type={IconSize.small} color="#d14b4b" hasCircle fillColor="#ffefef">{IconNames.close}</Icon>
                                <Text type={TextTypes.text} className={styles.legendText}>{__('No access', 'beyondseo')}</Text>
                            </div>
                            <div className={styles.legendItem}>
                                <span className={styles.limitedTag}>{__('Limited', 'beyondseo')}</span>
                                <Text type={TextTypes.text} className={styles.legendText}>{__('Partial access', 'beyondseo')}</Text>
                            </div>

                            <div className={styles.legendCta}>
                                <Button
                                    type={ButtonTypes.primary}
                                    size={ButtonSizes.medium}
                                    onClick={isOnboardingCompleted ? handleUpgradeClick : handleActivateForFree}
                                    isLoading={isOnboardingCompleted ? isLoading : false}
                                    disabled={isOnboardingCompleted ? isLoading : false}
                                    className={styles.legendButton}
                                >
                                    {isOnboardingCompleted
                                        ? __('Upgrade now', 'beyondseo')
                                        : __('Connect for free', 'beyondseo')
                                    }
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Feature Highlights Section */}
            <section className={styles.featureHighlightsSection}>
                <div className={styles.featureHighlightsContainer}>
                    <div className={styles.featureHighlightsHeader}>
                        <Text type={TextTypes.heading2} fontWeight={FontWeights.bold} className={styles.featureHighlightsTitle}>
                            {__('+45 features. 8 areas. 1 easy upgrade. 0 compromises.', 'beyondseo')}
                        </Text>
                        <Text type={TextTypes.text} className={styles.featureHighlightsSubtitle}>
                            {__('rankingCoach free combines everything you need for successful online marketing. Simple, effective, affordable.', 'beyondseo')}
                        </Text>
                    </div>

                    <div className={styles.featureHighlightsGrid}>
                        {featureHighlights.map((feature: FeatureHighlight) => (
                            <div key={feature.id} className={styles.featureHighlightCard}>
                                <div
                                    className={styles.featureIconWrapper}
                                    style={{ backgroundColor: feature.iconBackground }}
                                >
                                    <Icon type={IconSize.medium} color={feature.iconColor}>
                                        {feature.iconName || IconNames.check}
                                    </Icon>
                                </div>
                                <div className={styles.featureHighlightText}>
                                    <Text type={TextTypes.heading4} fontWeight={FontWeights.bold} className={styles.featureCardTitle}>
                                        {feature.title}
                                    </Text>
                                    <Text type={TextTypes.text} className={styles.featureCardDescription}>
                                        {feature.description}
                                    </Text>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Impact Metrics Section */}
            <section className={styles.impactSection}>
                <div
                    className={styles.impactContent}
                    style={{
                        backgroundImage: `url(${aiSparksBackgroundHorizontal})`
                    }}
                >
                    <div className={styles.impactMetricsRow}>
                        {impactMetrics.map((metric: ImpactMetric) => (
                            <div key={metric.label} className={styles.impactMetric}>
                                <Text type={TextTypes.heading1} fontWeight={FontWeights.bold} className={styles.impactValue}>
                                    {metric.value}
                                </Text>
                                <Text type={TextTypes.text} fontWeight={FontWeights.medium} className={styles.impactLabel}>
                                    {metric.label}
                                </Text>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className={styles.testimonialsSection}>
                <div className={styles.testimonialsContainer}>
                    <div className={styles.testimonialsHeader}>
                        <Text type={TextTypes.heading2} fontWeight={FontWeights.bold} className={styles.testimonialsTitle}>
                            {__('What our customers say', 'beyondseo')}
                        </Text>
                        <div className={styles.testimonialsRating}>
                            <div className={styles.ratingStars}>
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Icon key={i} type={IconSize.small} color="#FFB114">
                                        {IconNames.starActive}
                                    </Icon>
                                ))}
                            </div>
                            <Text type={TextTypes.text} className={styles.ratingScore}>
                                {__('4.84 out of 5', 'beyondseo')}
                            </Text>
                        </div>
                    </div>

                    <div className={styles.testimonialsGrid}>
                        {testimonials.map((testimonial: Testimonial) => (
                            <div key={testimonial.id} className={styles.testimonialCard}>
                                <img src={simpleQuoteCharacter} alt="" className={styles.quoteMark} />
                                <Text type={TextTypes.text} className={styles.testimonialText}>
                                    {testimonial.quote}
                                </Text>
                                <div className={styles.authorRow}>
                                    <img
                                        src={testimonial.avatar}
                                        alt={`${testimonial.author} avatar`}
                                        className={styles.avatar}
                                    />
                                    <Text type={TextTypes.text} fontWeight={FontWeights.bold} className={styles.authorName}>
                                        {testimonial.author}
                                    </Text>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className={styles.reviewPartners}>
                        <Text type={TextTypes.text} className={styles.partnerText}>
                            {__('Google Partner', 'beyondseo')}
                        </Text>
                        <a href="https://www.reviews.io/company-reviews/store/www.rankingcoach.com#page:Qr" target="_blank" rel="noopener noreferrer">
                            <img src={reviewsioLogo} alt="REVIEWS.io" className={styles.reviewsioLogo} />
                        </a>
                    </div>
                </div>
            </section>

            {/* Contact Sales Modal */}
            <ContactSalesModal
                isOpen={isContactModalOpen}
                onClose={() => setIsContactModalOpen(false)}
            />
        </div>
    );
};
