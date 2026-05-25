import React from "react";
import {
  Button,
  ButtonTypes,
  ButtonSizes,
  Text,
  TextTypes,
  FontWeights,
  Icon,
  IconNames,
  IconSize,
  PageSection,
  PageSectionBackground,
  TextIcon,
} from "vanguard";
import { __ } from "@wordpress/i18n";
import styles from "./Connect.module.scss";
import { rcWindow } from "@stores/window.store";
import simpleQuoteCharacter from "@assets/upsell-page/simple-quote-character.svg";
import reviewsioLogo from "@assets/upsell-page/reviewsio-logo.svg";
import seeYourPerformance from "@assets/connect-page/see-your-performance.svg";
import seeWhereYouStand from "@assets/connect-page/see-where-you.svg";
import alwaysKnowWhats from "@assets/connect-page/always-know-whats.svg";
import spotWhatsHolding from "@assets/connect-page/spot-whats-holding.svg";
import stayOnTopOf from "@assets/connect-page/stay-on-top-of.svg";
import trackYourProgress from "@assets/connect-page/track-your-progress.svg";
import { testimonials } from "@components/Upsell/upsellConfig";
import type { Testimonial } from "@components/Upsell/upsellConfig";

type FeatureCard = {
  id: string;
  title: string;
  illustration: string;
  className: string;
};

const featureCards: FeatureCard[] = [
  {
    id: "performance",
    title: __("See your performance instantly", "beyondseo"),
    illustration: seeYourPerformance,
    className: "cardPerformance",
  },
  {
    id: "competitors",
    title: __("See where you stand vs competitors", "beyondseo"),
    illustration: seeWhereYouStand,
    className: "cardCompetitors",
  },
  {
    id: "businessOnline",
    title: __("Always know what’s happening with your business online", "beyondseo"),
    illustration: alwaysKnowWhats,
    className: "cardBusinessOnline",
  },
  {
    id: "visibility",
    title: __("Spot what’s holding back your visibility", "beyondseo"),
    illustration: spotWhatsHolding,
    className: "cardVisibility",
  },
  {
    id: "reviews",
    title: __("Stay on top of your reviews and protect your reputation", "beyondseo"),
    illustration: stayOnTopOf,
    className: "cardReviews",
  },
  {
    id: "progress",
    title: __("Track your progress over time", "beyondseo"),
    illustration: trackYourProgress,
    className: "cardProgress",
  },
];

const rightNowItems: string[] = [
  __("Basic SEO checks only", "beyondseo"),
  __("No keyword or ranking tracking", "beyondseo"),
  __("No competitor data", "beyondseo"),
  __("No clear performance insights", "beyondseo"),
  __("Limited visibility into your results", "beyondseo"),
];

const withRcFreeItems: string[] = [
  __("Start tracking your own rankings, keywords & competitors", "beyondseo"),
  __("Finally see how visible you are on Google", "beyondseo"),
  __("Track how your performance improves over time", "beyondseo"),
  __("Compare your results with competitors", "beyondseo"),
  __("Monitor your reviews and online reputation", "beyondseo"),
];

export const Connect = () => {
  const handleActivateForFree = () => {
    const adminUrl = rcWindow?.rankingCoachReactData?.adminurl;
    window.location.href = `${adminUrl}?page=rankingcoach-onboarding`;
  };

  return (
    <div className={styles.connectPage}>
      <PageSection background={PageSectionBackground.gradientPrimaryMesh} noDefaultPadding className={styles.hero}>
        <div className={styles.heroTitle}>
          <Text type={TextTypes.display2} fontWeight={FontWeights.bold} color="var(--fn-fg-on-dark)">
            {__("Turn your free plugin into a growth engine", "beyondseo")}
          </Text>
        </div>

        <Text type={TextTypes.textIntro} color="var(--fn-fg-on-dark)" className={styles.heroSubtitle}>
          {__(
            "Activate your free account to track your visibility, improve your rankings and grow your business",
            "beyondseo",
          )}
        </Text>

        <Button
          type={ButtonTypes.secondary}
          size={ButtonSizes.medium}
          className={styles.heroButton}
          onClick={handleActivateForFree}
        >
          {__("Activate your free account", "beyondseo")}
        </Button>

        <div className={styles.heroDisclaimer}>
          <Text type={TextTypes.textHelp} color="var(--fn-fg-on-dark)">
            {__("100% free  • No credit card  • Takes less than 2 minutes", "beyondseo")}
          </Text>
        </div>

        <div className={styles.trustIndicators}>
          <span className={styles.trustIndicator}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Icon key={i} type={IconSize.small} color="var(--a2900)">
                {IconNames.starActive}
              </Icon>
            ))}
            <Text color="var(--fn-fg-on-dark)" type={FontWeights.medium}>
              {__("4.84/5 | 5,000+ Reviews", "beyondseo")}
            </Text>
          </span>
          <Text color="var(--fn-fg-on-dark)" type={FontWeights.medium}>
            {__("Google Partner", "beyondseo")}
          </Text>
        </div>
      </PageSection>

      <section className={styles.unlockSection}>
        <div className={styles.unlockHeader}>
          <Text type={TextTypes.heading2} fontWeight={FontWeights.bold} className={styles.unlockTitle}>
            {__("What you unlock with your free account", "beyondseo")}
          </Text>
          <Text type={TextTypes.text} className={styles.unlockSubtitle}>
            {__("It is 100% free, no credit card needed and it takes less than 2 minutes to activate", "beyondseo")}
          </Text>
        </div>

        <div className={styles.unlockCards}>
          <div className={styles.rightNowCard}>
            <Text type={TextTypes.heading4} fontWeight={FontWeights.bold} className={styles.cardHeading}>
              {__("Right now", "beyondseo")}
            </Text>
            <ul className={styles.unlockList}>
              {rightNowItems.map((item, index) => (
                <li key={index}>
                  <TextIcon
                    icon={IconNames.close}
                    iconColor="var(--n700)"
                    iconSize={IconSize.small}
                    textType={TextTypes.text}
                    textColor="var(--n700)"
                    verticalAlign="start"
                    className={styles.unlockItemText}
                  >
                    {item}
                  </TextIcon>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.withFreeCard}>
            {/*TODO: I've the text "with rankingCoach Free" to "After activation", because the Connect page will be shown also Ionos users, there we have to come up with solution*/}
            <Text type={TextTypes.heading4} fontWeight={FontWeights.bold} className={styles.cardHeading}>
              {__("After activation", "beyondseo")}
            </Text>
            <ul className={styles.unlockList}>
              {withRcFreeItems.map((item, index) => (
                <li key={index}>
                  <TextIcon
                    icon={IconNames.check}
                    iconColor="var(--white)"
                    iconSize={IconSize.small}
                    textType={TextTypes.text}
                    textColor="var(--white)"
                    fontWeight={FontWeights.bold}
                    verticalAlign="start"
                    className={styles.unlockItemText}
                  >
                    {item}
                  </TextIcon>
                </li>
              ))}
            </ul>

            <Button
              type={ButtonTypes.secondary}
              size={ButtonSizes.medium}
              className={styles.activateButton}
              onClick={handleActivateForFree}
            >
              {__("Activate your free account", "beyondseo")}
            </Button>
          </div>
        </div>
      </section>

      <section className={styles.growSection}>
        <Text type={TextTypes.heading2} fontWeight={FontWeights.bold} className={styles.growTitle}>
          {__("Everything you need to start growing", "beyondseo")}
        </Text>

        <div className={styles.cardsGrid}>
          {featureCards.map((card) => (
            <div key={card.id} className={`${styles.featureCard} ${styles[card.className]}`}>
              <Text type={TextTypes.textIntro} className={styles.featureCardTitle}>
                {card.title}
              </Text>
              <img src={card.illustration} alt="" className={styles.featureCardIllustration} />
            </div>
          ))}
        </div>
      </section>

      <section className={styles.testimonialsSection}>
        <div className={styles.testimonialsContainer}>
          <div className={styles.testimonialsHeader}>
            <Text type={TextTypes.heading2} fontWeight={FontWeights.bold} className={styles.testimonialsTitle}>
              {__("Join 1M+ businesses already growing", "beyondseo")}
            </Text>
            <div className={styles.testimonialsRating}>
              <div className={styles.ratingStars}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Icon key={i} type={IconSize.small} color="var(--a2900)">
                    {IconNames.starActive}
                  </Icon>
                ))}
              </div>
              <Text type={TextTypes.text} className={styles.ratingScore}>
                {__("4.84 out of 5", "beyondseo")}
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
                  <img src={testimonial.avatar} alt={`${testimonial.author} avatar`} className={styles.avatar} />
                  <Text type={TextTypes.text} fontWeight={FontWeights.bold} className={styles.authorName}>
                    {testimonial.author}
                  </Text>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.reviewPartners}>
            <Text type={TextTypes.text} className={styles.partnerText}>
              {__("Google Partner", "beyondseo")}
            </Text>
            <a
              href="https://www.reviews.io/company-reviews/store/www.rankingcoach.com#page:Qr"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={reviewsioLogo} alt="REVIEWS.io" className={styles.reviewsioLogo} />
            </a>
          </div>
        </div>
      </section>

      <section className={styles.finalCtaSection}>
        <PageSection
          background={PageSectionBackground.gradientPrimaryMesh}
          noDefaultPadding
          className={styles.finalCtaCard}
        >
          <Text
            type={TextTypes.heading2}
            fontWeight={FontWeights.bold}
            color="var(--fn-fg-on-dark)"
            className={styles.finalCtaTitle}
          >
            {__("Activate your free account and start seeing results today", "beyondseo")}
          </Text>

          <Text type={TextTypes.textIntro} color="var(--fn-fg-on-dark)" className={styles.finalCtaSubtitle}>
            {__("Track your performance and see results in minutes", "beyondseo")}
          </Text>

          <Button
            type={ButtonTypes.secondary}
            size={ButtonSizes.medium}
            className={styles.finalCtaButton}
            onClick={handleActivateForFree}
          >
            {__("Activate your free account", "beyondseo")}
          </Button>

          <Text type={TextTypes.textHelp} color="var(--fn-fg-on-dark)" className={styles.finalCtaDisclaimer}>
            {__("100% free  • No credit card  • Takes less than 2 minutes", "beyondseo")}
          </Text>
        </PageSection>
      </section>
    </div>
  );
};
