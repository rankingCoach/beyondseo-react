import React, { useState } from 'react';
import {
    EditModal,
    Input,
    Textarea,
    Select,
    Form,
    ComponentContainer,
    classNames,
    CheckBox
} from 'vanguard';
import styles from './ContactSalesModal.module.scss';
import { contactSalesModalConfig } from './connectConfig';

interface ContactSalesModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const ContactSalesModal: React.FC<ContactSalesModalProps> = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        companyName: '',
        name: '',
        email: '',
        phoneNumber: '',
        industry: '',
        howDidYouFindUs: '',
        message: '',
        agreeToContact: false,
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const isFormValid =
        formData.companyName.trim().length > 0 &&
        formData.name.trim().length > 0 &&
        formData.email.trim().length > 0 &&
        formData.message.trim().length > 0;

    const isSubmitEnabled = formData.agreeToContact && isFormValid && !isSubmitting;

    const handleInputChange = (field: string, value: string | boolean | React.ChangeEvent<HTMLInputElement>) => {
        if (typeof value === 'object' && 'target' in value) {
            // Handle checkbox event
            setFormData(prev => ({ ...prev, [field]: value.target.checked }));
        } else {
            // Handle direct string or boolean value
            setFormData(prev => ({ ...prev, [field]: value }));
        }
    };

    const handleSubmit = async () => {
        if (!isSubmitEnabled) return;

        setIsSubmitting(true);

        // TODO: Implement actual form submission logic
        console.log('Form submitted:', formData);

        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            onClose();
            // Reset form
            setFormData({
                companyName: '',
                name: '',
                email: '',
                phoneNumber: '',
                industry: '',
                howDidYouFindUs: '',
                message: '',
                agreeToContact: false,
            });
        }, 1000);
    };

    const handleClose = () => {
        if (!isSubmitting) {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <ComponentContainer className={styles.modalWrapper}>
            <EditModal
                title=""
                close={handleClose}
                closeOnSave={false}
                saveCallback={handleSubmit}
                savable={isSubmitEnabled}
                savingInProgress={isSubmitting}
                width="1148px"
                positiveBtnText={contactSalesModalConfig.submitButtonText}
                className={classNames(styles.contactSalesModal)}
            >
                <ComponentContainer className={styles.modalContent}>
                    <Form className={styles.modalForm}>
                        <div className={styles.formRow}>
                            <div className={styles.formField}>
                                <Input
                                    label={contactSalesModalConfig.fields.companyName.label}
                                    required={contactSalesModalConfig.fields.companyName.required}
                                    value={formData.companyName}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                        handleInputChange('companyName', e.target.value)
                                    }
                                    placeholder={contactSalesModalConfig.fields.companyName.placeholder}
                                />
                            </div>

                            <div className={styles.formField}>
                                <Input
                                    label={contactSalesModalConfig.fields.name.label}
                                    required={contactSalesModalConfig.fields.name.required}
                                    value={formData.name}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                        handleInputChange('name', e.target.value)
                                    }
                                    placeholder={contactSalesModalConfig.fields.name.placeholder}
                                />
                            </div>
                        </div>

                        <div className={styles.formRow}>
                            <div className={styles.formField}>
                                <Input
                                    label={contactSalesModalConfig.fields.email.label}
                                    required={contactSalesModalConfig.fields.email.required}
                                    type="email"
                                    value={formData.email}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                        handleInputChange('email', e.target.value)
                                    }
                                    placeholder={contactSalesModalConfig.fields.email.placeholder}
                                />
                            </div>

                            <div className={styles.formField}>
                                <Input
                                    label={contactSalesModalConfig.fields.phoneNumber.label}
                                    required={contactSalesModalConfig.fields.phoneNumber.required}
                                    type="tel"
                                    value={formData.phoneNumber}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                        handleInputChange('phoneNumber', e.target.value)
                                    }
                                    placeholder={contactSalesModalConfig.fields.phoneNumber.placeholder}
                                />
                            </div>
                        </div>

                        <div className={styles.formRow}>
                            <div className={styles.formField}>
                                <Select
                                    label={contactSalesModalConfig.fields.industry.label}
                                    required={contactSalesModalConfig.fields.industry.required}
                                    value={formData.industry}
                                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                                        handleInputChange('industry', e.target.value)
                                    }
                                >
                                    <option value="" disabled>
                                        {contactSalesModalConfig.fields.industry.placeholder}
                                    </option>
                                    {contactSalesModalConfig.fields.industry.options?.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </Select>
                            </div>

                            <div className={styles.formField}>
                                <Select
                                    label={contactSalesModalConfig.fields.howDidYouFindUs.label}
                                    required={contactSalesModalConfig.fields.howDidYouFindUs.required}
                                    value={formData.howDidYouFindUs}
                                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                                        handleInputChange('howDidYouFindUs', e.target.value)
                                    }
                                >
                                    <option value="" disabled>
                                        {contactSalesModalConfig.fields.howDidYouFindUs.placeholder}
                                    </option>
                                    {contactSalesModalConfig.fields.howDidYouFindUs.options?.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </Select>
                            </div>
                        </div>

                        <div className={styles.formField}>
                            <Textarea
                                label={contactSalesModalConfig.fields.message.label}
                                required={contactSalesModalConfig.fields.message.required}
                                value={formData.message}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                                    handleInputChange('message', e.target.value)
                                }
                                placeholder={contactSalesModalConfig.fields.message.placeholder}
                                rows={4}
                                minRows={4}
                                maxLength={contactSalesModalConfig.fields.message.maxLength}
                            />
                        </div>

                        <div className={styles.checkboxField}>
                            <CheckBox
                                checked={formData.agreeToContact}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('agreeToContact', e)}
                                label={contactSalesModalConfig.checkboxText}
                            />
                        </div>
                    </Form>
                </ComponentContainer>
            </EditModal>
        </ComponentContainer>
    );
};
