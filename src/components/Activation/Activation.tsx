import * as React from "react";
import { useEffect, useState } from "react";
import styles from "./Activation.module.scss";
import { Button, ButtonSizes, ButtonTypes, ComponentContainer, IconNames, Input, CheckBox, Text, TextTypes, FontWeights, Link } from "vanguard";
import { __, sprintf } from "@wordpress/i18n";
import beyondSEOLogo from "@assets/beyondSEO-logo.svg";
import { useSelector } from "react-redux";
import { RootState } from "@src/main.store";
import { isValidEmail } from "@helpers/string-helpers";

interface ActivationProps {
    isPluginLoading?: boolean;
}

type ActivationView = 'form' | 'error' | 'success' | 'recover' | 'recoverSuccess';

export const Activation: React.FC<ActivationProps> = ({ isPluginLoading }) => {
    const rcData = (window as any).rankingCoachReactData || {};
    const ACTIVATE_URL = `${rcData.endpoint || ''}/account/activate`;
    const RECOVER_URL = `${rcData.endpoint || ''}/account/recoverActivationCode`;
    const ONBOARDING_URL = `${rcData.adminurl || 'admin.php'}?page=rankingcoach-onboarding&skipWelcomeScreen=1`;
    const REGISTRATION_URL = `${rcData.adminurl || 'admin.php'}?page=rankingcoach-registration`;
    // Channel- and locale-aware support link resolved server-side (Assets::getSupportUrl): IONOS support only for
    // the ionos channel, rankingCoach support for everything else — the same default the fallback keeps.
    const SUPPORT_URL: string = rcData.supportUrl || 'https://grow.rankingcoach.com/wordpress/contact';

    const [view, setView] = useState<ActivationView>('form');
    const [activationCode, setActivationCode] = useState('');
    const [commOptIn, setCommOptIn] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [errorDetails, setErrorDetails] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [codeError, setCodeError] = useState('');
    const { plugin } = useSelector((state: RootState) => state.app);
    const adminEmail = plugin?.pluginData?.website?.settings?.adminEmail || '';
    const [recoverEmail, setRecoverEmail] = useState(adminEmail);
    const [recoverEmailError, setRecoverEmailError] = useState('');
    const [isRecovering, setIsRecovering] = useState(false);

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
                setErrorDetails(typeof data.details === 'string' ? data.details : '');
                setView('error');
            }
        } catch (e) {
            setErrorMessage(__('An unexpected error occurred.', 'beyondseo'));
            setErrorDetails('');
            setView('error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRecoverSubmit = async () => {
        if (isRecovering) return;
        const email = recoverEmail.trim();
        if (!isValidEmail(email)) {
            setRecoverEmailError(__('Please enter a valid email address.', 'beyondseo'));
            return;
        }
        setRecoverEmailError('');
        setIsRecovering(true);
        try {
            const res = await fetch(RECOVER_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-WP-Nonce': rcData.restNonce || '',
                },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();
            if (data.success === true) {
                setView('recoverSuccess');
            } else {
                setErrorMessage(data.message || __('We could not send a recovery email. Please contact customer support.', 'beyondseo'));
                setErrorDetails(typeof data.details === 'string' ? data.details : (data.code ? String(data.code) : `HTTP ${res.status}`));
                setView('error');
            }
        } catch (e) {
            setErrorMessage(__('We could not send a recovery email. Please contact customer support.', 'beyondseo'));
            setErrorDetails(e instanceof Error ? e.message : '');
            setView('error');
        } finally {
            setIsRecovering(false);
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
                        <Link className={styles.recoverLink} onClick={() => { setRecoverEmailError(''); setView('recover'); }}>
                            {__('Lost your activation code? Recover it here', 'beyondseo')}
                        </Link>

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
                        {errorDetails && (
                            <Text type={TextTypes.text} className={styles.errorDetails}>
                                {sprintf(__('Details: %s', 'beyondseo'), errorDetails)}
                            </Text>
                        )}
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

                {view === 'recover' && (
                    <>
                        <Text
                            type={TextTypes.heading1}
                            fontWeight={FontWeights.bold}
                            className={styles.authTitle}
                        >
                            {__('Recover your activation code', 'beyondseo')}
                        </Text>

                        <Text
                            type={TextTypes.text}
                            className={styles.authDescription}
                        >
                            {__('Enter the email address your rankingCoach subscription is registered with. We will send your activation code to that address.', 'beyondseo')}
                        </Text>

                        <Input
                            label={__('Email', 'beyondseo')}
                            required={true}
                            value={recoverEmail}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRecoverEmail(e.target.value)}
                            type="email"
                            className={styles.activationInput}
                        />
                        {recoverEmailError && (
                            <Text type={TextTypes.text} className={styles.codeError}>
                                {recoverEmailError}
                            </Text>
                        )}
                    </>
                )}

                {view === 'recoverSuccess' && (
                    <>
                        <Text
                            type={TextTypes.heading1}
                            fontWeight={FontWeights.bold}
                            className={styles.authTitle}
                        >
                            {__('Check your inbox', 'beyondseo')}
                        </Text>
                        <Text type={TextTypes.text} className={styles.authDescription}>
                            {sprintf(__('We have sent your activation code to %s. Enter it below once it arrives.', 'beyondseo'), recoverEmail.trim())}
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

                {view === 'recover' && (
                    <>
                        <Button
                            type={ButtonTypes.secondary}
                            size={ButtonSizes.medium}
                            iconLeft={IconNames.arrowLeft}
                            onClick={() => setView('form')}
                            className={styles.backButton}
                            disabled={isRecovering}
                        >
                            {__('Back', 'beyondseo')}
                        </Button>
                        <Button
                            type={ButtonTypes.primary}
                            size={ButtonSizes.medium}
                            onClick={handleRecoverSubmit}
                            disabled={isRecovering || recoverEmail.trim() === ''}
                            isLoading={isRecovering}
                            aria-busy={isRecovering}
                        >
                            {__('Send recovery email', 'beyondseo')}
                        </Button>
                    </>
                )}

                {view === 'recoverSuccess' && (
                    <Button
                        type={ButtonTypes.primary}
                        size={ButtonSizes.medium}
                        onClick={() => setView('form')}
                    >
                        {__('Enter activation code', 'beyondseo')}
                    </Button>
                )}
            </div>
        </ComponentContainer>
    );
};
