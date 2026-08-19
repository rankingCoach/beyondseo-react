import * as React from "react";
import { useEffect, useState } from "react";
import styles from "./Activation.module.scss";
import { Button, ButtonSizes, ButtonTypes, ComponentContainer, IconNames, Input, CheckBox, Text, TextTypes, FontWeights, Link } from "vanguard";
import { __ } from "@wordpress/i18n";
import beyondSEOLogo from "@assets/beyondSEO-logo.svg";

interface ActivationProps {
    isPluginLoading?: boolean;
}

type ActivationView = 'form' | 'error' | 'success';

export const Activation: React.FC<ActivationProps> = ({ isPluginLoading }) => {
    const rcData = (window as any).rankingCoachReactData || {};
    const ACTIVATE_URL = `${rcData.endpoint || ''}/account/activate`;
    const ONBOARDING_URL = `${rcData.adminurl || 'admin.php'}?page=rankingcoach-onboarding&skipWelcomeScreen=1`;
    const REGISTRATION_URL = `${rcData.adminurl || 'admin.php'}?page=rankingcoach-registration`;
    const locale: string = rcData.locale || '';
    const SUPPORT_URL = locale.startsWith('de')
        ? 'https://mein.ionos.de/support/contact'
        : 'https://my.ionos.com/support/contact';

    const [view, setView] = useState<ActivationView>('form');
    const [activationCode, setActivationCode] = useState('');
    const [commOptIn, setCommOptIn] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [codeError, setCodeError] = useState('');

    useEffect(() => {
        if (view !== 'success') return;
        const timer = setTimeout(() => { window.location.href = ONBOARDING_URL; }, 5000);
        return () => clearTimeout(timer);
    }, [view]);

    const handleSubmit = async () => {
        if (!commOptIn || isLoading) return;
        if (activationCode.trim() === '') {
            setCodeError(__('Activation code is required.', 'beyondseo'));
            return;
        }
        setCodeError('');
        setIsLoading(true);
        try {
            const res = await fetch(ACTIVATE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-WP-Nonce': rcData.restNonce || '',
                },
                body: JSON.stringify({ activationCode: activationCode.trim(), commOptIn }),
            });
            const data = await res.json();
            if (data.success === true) {
                setView('success');
            } else {
                setErrorMessage(data.message || __('Activation failed.', 'beyondseo'));
                setView('error');
            }
        } catch (e) {
            setErrorMessage(__('An unexpected error occurred.', 'beyondseo'));
            setView('error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ComponentContainer className={styles.activationContainer}>
            <div className={styles.headerSection}>
                <div className={styles.logo}>
                    <img src={beyondSEOLogo} alt="BeyondSEO" />
                </div>
            </div>

            <div className={styles.topDivider} />

            <div className={styles.activationContent}>
                {view === 'form' && (
                    <>
                        <Text
                            type={TextTypes.heading1}
                            fontWeight={FontWeights.bold}
                            className={styles.authTitle}
                        >
                            {__('Enter your activation code', 'beyondseo')}
                        </Text>

                        <Text
                            type={TextTypes.text}
                            className={styles.authDescription}
                        >
                            {__('Enter the activation code provided by your provider.', 'beyondseo')}
                        </Text>

                        <Input
                            label={__('Activation Code', 'beyondseo')}
                            required={true}
                            value={activationCode}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setActivationCode(e.target.value)}
                            placeholder={__('Enter your activation code', 'beyondseo')}
                            type="text"
                            className={styles.activationInput}
                        />
                        {codeError && (
                            <Text type={TextTypes.text} className={styles.codeError}>
                                {codeError}
                            </Text>
                        )}

                        <div className={styles.termsContainer}>
                            <CheckBox
                                checked={commOptIn}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCommOptIn(e.target.checked)}
                                label={
                                    <span>
                                        {__('I agree that the BeyondSEO plugin may create/authenticate my account and communicate with rankingCoach servers to provide its services. I have read and accept the ', 'beyondseo')}
                                        <Link href="https://www.rankingcoach.com/en-us/privacy-policy" target="_blank" rel="noopener noreferrer">
                                            {__('Privacy Policy', 'beyondseo')}
                                        </Link>
                                        {__(' and the ', 'beyondseo')}
                                        <Link href="https://www.rankingcoach.com/en-us/terms-and-conditions" target="_blank" rel="noopener noreferrer">
                                            {__('Terms and Conditions', 'beyondseo')}
                                        </Link>.
                                    </span>
                                }
                            />
                        </div>
                    </>
                )}

                {view === 'error' && (
                    <>
                        <div className={styles.errorIcon}>!</div>
                        <Text type={TextTypes.text} className={styles.authDescription}>
                            {errorMessage}
                        </Text>
                        <Link href={SUPPORT_URL} target="_blank" rel="noopener noreferrer">
                            {__('Contact support', 'beyondseo')}
                        </Link>
                    </>
                )}

                {view === 'success' && (
                    <>
                        <Text
                            type={TextTypes.heading1}
                            fontWeight={FontWeights.bold}
                            className={styles.authTitle}
                        >
                            {__('Activation done', 'beyondseo')}
                        </Text>
                        <Text type={TextTypes.text} className={styles.authDescription}>
                            {__('You will be automatically redirected in 5 seconds...', 'beyondseo')}
                        </Text>
                    </>
                )}
            </div>

            <div className={styles.bottomDivider} />

            <div className={styles.footerSection}>
                {view === 'form' && (
                    <>
                        <Button
                            type={ButtonTypes.secondary}
                            size={ButtonSizes.medium}
                            iconLeft={IconNames.arrowLeft}
                            onClick={() => { window.location.href = REGISTRATION_URL; }}
                            className={styles.backButton}
                            disabled={isLoading}
                        >
                            {__('Back', 'beyondseo')}
                        </Button>
                        <Button
                            type={ButtonTypes.primary}
                            size={ButtonSizes.medium}
                            onClick={handleSubmit}
                            disabled={!commOptIn || isLoading}
                            isLoading={isLoading}
                            aria-busy={isLoading}
                        >
                            {__('Activate', 'beyondseo')}
                        </Button>
                    </>
                )}

                {view === 'error' && (
                    <Button
                        type={ButtonTypes.primary}
                        size={ButtonSizes.medium}
                        onClick={() => setView('form')}
                    >
                        {__('Try another code', 'beyondseo')}
                    </Button>
                )}

                {view === 'success' && (
                    <Button
                        type={ButtonTypes.primary}
                        size={ButtonSizes.medium}
                        onClick={() => { window.location.href = ONBOARDING_URL; }}
                    >
                        {__('Continue onboarding', 'beyondseo')}
                    </Button>
                )}
            </div>
        </ComponentContainer>
    );
};
