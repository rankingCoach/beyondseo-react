import { __ } from '@wordpress/i18n';
import { IconNames } from 'vanguard';
import avatar1 from '@assets/upsell-page/avatar-1.svg';
import avatar2 from '@assets/upsell-page/avatar-2.svg';
import avatar3 from '@assets/upsell-page/avatar-3.svg';
import avatar4 from '@assets/upsell-page/avatar-4.svg';
import avatar5 from '@assets/upsell-page/avatar-5.svg';
import avatar6 from '@assets/upsell-page/avatar-6.svg';

export type StatusType = 'check' | 'cross' | 'limited' | 'text';

export type StatusValue = {
    type: StatusType;
    label?: string;
};

export type FeatureRow = {
    label: string;
    radar: StatusValue;
    rc360: StatusValue;
};

export type FeatureCategory = {
    id: string;
    title: string;
    radar: StatusValue;
    rc360: StatusValue;
    rows: FeatureRow[];
};

export type Stat = { label: string; value: string; change: string };
export type ImpactMetric = { value: string; label: string };
export type Testimonial = { id: string; quote: string; author: string; avatar: string };
export type ProfessionalCard = { title: string; description: string; icon: IconNames | string };
export type FeatureHighlight = {
    id: string;
    title: string;
    description: string;
    iconColor: string;
    iconBackground: string;
    iconName: IconNames;
};
export type PlanFeature = { text: string; checked?: boolean };

export const featureCategories: FeatureCategory[] = [
    {
        id: 'general',
        title: __('General features', 'beyondseo'),
        radar: { type: 'limited', label: __('Limited', 'beyondseo') },
        rc360: { type: 'check' },
        rows: [
            {
                label: __('Projects Included', 'beyondseo'),
                radar: { type: 'text', label: '1' },
                rc360: { type: 'text', label: '1' },
            },
            {
                label: __('BeyondSEO WordPress plugin', 'beyondseo'),
                radar: { type: 'limited', label: __('Limited', 'beyondseo') },
                rc360: { type: 'check' },
            },
        ],
    },
    {
        id: 'brand',
        title: __('Brand Monitoring', 'beyondseo'),
        radar: { type: 'check' },
        rc360: { type: 'check' },
        rows: [
            { label: __('Brand & competitor monitoring feed', 'beyondseo'), radar: { type: 'check' }, rc360: { type: 'check' } },
            { label: __('Weekly reports', 'beyondseo'), radar: { type: 'check' }, rc360: { type: 'check' } },
            { label: __('Email alerts', 'beyondseo'), radar: { type: 'check' }, rc360: { type: 'check' } },
        ],
    },
    {
        id: 'seo',
        title: __('SEO', 'beyondseo'),
        radar: { type: 'limited', label: __('Limited', 'beyondseo') },
        rc360: { type: 'check' },
        rows: [
            { label: __('Tasks with video tutorials', 'beyondseo'), radar: { type: 'limited', label: __('Limited', 'beyondseo') }, rc360: { type: 'check' } },
            { label: __('AI-powered SEO tasks', 'beyondseo'), radar: { type: 'cross' }, rc360: { type: 'check' } },
            { label: __('AI text optimisation', 'beyondseo'), radar: { type: 'cross' }, rc360: { type: 'check' } },
            { label: __('AI URL optimiser', 'beyondseo'), radar: { type: 'cross' }, rc360: { type: 'check' } },
            { label: __('Keyword tracking', 'beyondseo'), radar: { type: 'text', label: '3' }, rc360: { type: 'text', label: '50' } },
            { label: __('Locations tracked', 'beyondseo'), radar: { type: 'text', label: '1' }, rc360: { type: 'text', label: '5' } },
            { label: __('Competitors monitoring', 'beyondseo'), radar: { type: 'text', label: '3' }, rc360: { type: 'text', label: '5' } },
            { label: __('Google Analytics integration', 'beyondseo'), radar: { type: 'check' }, rc360: { type: 'check' } },
            { label: __('Detailed SEO reports', 'beyondseo'), radar: { type: 'check' }, rc360: { type: 'check' } },
        ],
    },
    {
        id: 'online-presence',
        title: __('Online Presence', 'beyondseo'),
        radar: { type: 'limited', label: __('Limited', 'beyondseo') },
        rc360: { type: 'check' },
        rows: [
            { label: __('Directory checker', 'beyondseo'), radar: { type: 'check' }, rc360: { type: 'check' } },
            { label: __('Business Profile creation', 'beyondseo'), radar: { type: 'check' }, rc360: { type: 'check' } },
            { label: __('Profile fine-tuning', 'beyondseo'), radar: { type: 'check' }, rc360: { type: 'check' } },
            {
                label: __('Publish Business Profile on', 'beyondseo'),
                radar: { type: 'text', label: __('Just on Google Business Profile & Facebook', 'beyondseo') },
                rc360: { type: 'text', label: __('Google Business Profile, Facebook and up to 46 directories', 'beyondseo') },
            },
            { label: __('Listings protection', 'beyondseo'), radar: { type: 'cross' }, rc360: { type: 'check' } },
            { label: __('Online Presence insights', 'beyondseo'), radar: { type: 'limited', label: __('Limited', 'beyondseo') }, rc360: { type: 'check' } },
        ],
    },
    {
        id: 'google-ads',
        title: __('Google Ads', 'beyondseo'),
        radar: { type: 'cross' },
        rc360: { type: 'check' },
        rows: [
            { label: __('Campaign creation', 'beyondseo'), radar: { type: 'cross' }, rc360: { type: 'check' } },
            { label: __('Automatically generated ad texts', 'beyondseo'), radar: { type: 'cross' }, rc360: { type: 'check' } },
            { label: __('Budget control', 'beyondseo'), radar: { type: 'cross' }, rc360: { type: 'check' } },
            { label: __('Performance insights', 'beyondseo'), radar: { type: 'cross' }, rc360: { type: 'check' } },
        ],
    },
    {
        id: 'social',
        title: __('Social', 'beyondseo'),
        radar: { type: 'limited', label: __('Limited', 'beyondseo') },
        rc360: { type: 'check' },
        rows: [
            { label: __('Create & publish events on Google Business Profile', 'beyondseo'), radar: { type: 'check' }, rc360: { type: 'check' } },
            {
                label: __('Create & publish posts on', 'beyondseo'),
                radar: { type: 'text', label: __('Just on Google Business Profile, Facebook, Instagram', 'beyondseo') },
                rc360: { type: 'text', label: __('Google Business Profile, Facebook, Instagram, X, LinkedIn', 'beyondseo') },
            },
            { label: __('AI image generator', 'beyondseo'), radar: { type: 'cross' }, rc360: { type: 'check' } },
            { label: __('Social Media Planner with calendar view', 'beyondseo'), radar: { type: 'cross' }, rc360: { type: 'check' } },
            { label: __('Boost posts with Meta ads', 'beyondseo'), radar: { type: 'cross' }, rc360: { type: 'check' } },
            { label: __('Competitor-based post suggestions', 'beyondseo'), radar: { type: 'check' }, rc360: { type: 'check' } },
            { label: __('AI content for posts & events', 'beyondseo'), radar: { type: 'check' }, rc360: { type: 'check' } },
            { label: __('View & respond to post comments', 'beyondseo'), radar: { type: 'check' }, rc360: { type: 'check' } },
            { label: __('Link performance', 'beyondseo'), radar: { type: 'check' }, rc360: { type: 'check' } },
            { label: __('Social Media insights', 'beyondseo'), radar: { type: 'check' }, rc360: { type: 'check' } },
        ],
    },
    {
        id: 'reputation',
        title: __('Web Reputation', 'beyondseo'),
        radar: { type: 'limited', label: __('Limited', 'beyondseo') },
        rc360: { type: 'check' },
        rows: [
            { label: __('View reviews from multiple platforms', 'beyondseo'), radar: { type: 'check' }, rc360: { type: 'check' } },
            { label: __('Manual review replies', 'beyondseo'), radar: { type: 'check' }, rc360: { type: 'check' } },
            { label: __('Generate replies to reviews with AI', 'beyondseo'), radar: { type: 'check' }, rc360: { type: 'check' } },
            { label: __('Automatic replies with AI', 'beyondseo'), radar: { type: 'cross' }, rc360: { type: 'check' } },
            { label: __('Review booster (Send review requests via email and print materials)', 'beyondseo'), radar: { type: 'cross' }, rc360: { type: 'check' } },
            { label: __('Showcase Reviews widget', 'beyondseo'), radar: { type: 'check' }, rc360: { type: 'check' } },
            { label: __('Collect Reviews widget', 'beyondseo'), radar: { type: 'cross' }, rc360: { type: 'check' } },
            { label: __('Additional review sources', 'beyondseo'), radar: { type: 'cross' }, rc360: { type: 'check' } },
            { label: __('Mentions', 'beyondseo'), radar: { type: 'cross' }, rc360: { type: 'check' } },
            { label: __('Reputation sentiment analysis', 'beyondseo'), radar: { type: 'cross' }, rc360: { type: 'check' } },
            { label: __('Reputation insights', 'beyondseo'), radar: { type: 'check' }, rc360: { type: 'check' } },
        ],
    },
];

export const defaultExpandedCategoryIds = featureCategories.map(c => c.id);

export const stats: Stat[] = [
    { label: __('Google ads clicks', 'beyondseo'), value: '854', change: '+24%' },
    { label: __('Boosted posts engagement', 'beyondseo'), value: '5076', change: '+28%' },
    { label: __('AI auto-replies', 'beyondseo'), value: '50', change: '+125%' },
    { label: __('Reach', 'beyondseo'), value: '42.8k', change: '+14%' },
];

export const impactMetrics: ImpactMetric[] = [
    { value: '10', label: __('Hours saved weekly', 'beyondseo') },
    { value: '90%', label: __('Avg. visibility increase', 'beyondseo') },
    { value: '45+', label: __('Directory integrations', 'beyondseo') },
];

export const testimonials: Testimonial[] = [
    {
        id: 'milano',
        quote: __('They improved my website\'s ranking. Simple, intuitive actions and fair pricing.', 'beyondseo'),
        author: __('Agenzia Grafica Milano', 'beyondseo'),
        avatar: avatar1,
    },
    {
        id: 'play-music',
        quote: __('It is simply the best tool to control, optimize and position your business from one place. Highly recommended!', 'beyondseo'),
        author: __('Play Music Co.', 'beyondseo'),
        avatar: avatar2,
    },
    {
        id: 'nieuwenburg',
        quote: __('A clear overview of what is happening on your site and what to do to improve it. We are very satisfied - TOP!', 'beyondseo'),
        author: __('John Nieuwenburg', 'beyondseo'),
        avatar: avatar3,
    },
    {
        id: 'gandars',
        quote: __('A really great tool for work. It\'s helped me get more clients and reach more people.', 'beyondseo'),
        author: __('Irving Gandars', 'beyondseo'),
        avatar: avatar4,
    },
    {
        id: 'ecs',
        quote: __('Excellent tool with great visibility. Simple, efficient, and powerful. I recommend it.', 'beyondseo'),
        author: __('Expert Coaching Solutions (ECS)', 'beyondseo'),
        avatar: avatar5,
    },
    {
        id: 'quesada',
        quote: __('I really like this tool. Setting your competitors in the config gives you very useful insights to help you improve.', 'beyondseo'),
        author: __('Fran Quesada', 'beyondseo'),
        avatar: avatar6,
    },
];

export const reviewPartners = [__('Google Partner', 'beyondseo'), __('REVIEWS.io', 'beyondseo')];

export const professionalCards: ProfessionalCard[] = [
    {
        title: __('Web Agency', 'beyondseo'),
        description: __('Manage multiple client websites and campaigns from one dashboard.', 'beyondseo'),
        icon: IconNames.category || 'category',
    },
    {
        title: __('Enterprise', 'beyondseo'),
        description: __('Custom solutions for large organizations with multiple locations.', 'beyondseo'),
        icon: IconNames.business || 'business',
    },
    {
        title: __('Freelancer / Consultant', 'beyondseo'),
        description: __('Handle your clients professionally and efficiently.', 'beyondseo'),
        icon: IconNames.user || 'user',
    }
];

export const agencyFeatures: string[] = [
    __('Manage all client projects in one place', 'beyondseo'),
    __('Advanced analytics and performance insights', 'beyondseo'),
    __('Comprehensive white-label reporting', 'beyondseo'),
    __('Task time tracking and monitoring', 'beyondseo'),
    __('Sub-account and user permissions management', 'beyondseo'),
    __('Give your clients bespoke account access to their white-label reports', 'beyondseo'),
];

export const featureHighlights: FeatureHighlight[] = [
    {
        id: 'seo',
        title: __('SEO', 'beyondseo'),
        description: __('Full AI-powered SEO. Get personalised guidance and video tutorials. No experience needed.', 'beyondseo'),
        iconColor: '#1bbf73',
        iconBackground: '#e8f8f1',
        iconName: IconNames.search,
    },
    {
        id: 'google-ads',
        title: __('Google Ads', 'beyondseo'),
        description: __('Create AI-powered ads in 3 steps. Professional Google Ads, ready to launch immediately.', 'beyondseo'),
        iconColor: '#ff477e',
        iconBackground: '#ffe8f0',
        iconName: IconNames.gAds,
    },
    {
        id: 'online-presence',
        title: __('Online Presence', 'beyondseo'),
        description: __('Publish your business automatically in 46+ directories. Visible everywhere with one click.', 'beyondseo'),
        iconColor: '#3a86ff',
        iconBackground: '#e6f0ff',
        iconName: IconNames.business,
    },
    {
        id: 'web-reputation',
        title: __('Web Reputation', 'beyondseo'),
        description: __('Never miss a review again. AI responds automatically in your preferred tone.', 'beyondseo'),
        iconColor: '#f6c343',
        iconBackground: '#fff5da',
        iconName: IconNames.starActive,
    },
    {
        id: 'brand-monitoring',
        title: __('Brand Monitoring', 'beyondseo'),
        description: __('Find out instantly when your business is mentioned online. Stay informed at all times.', 'beyondseo'),
        iconColor: '#6b5dfc',
        iconBackground: '#f0edff',
        iconName: IconNames.shieldActive,
    },
    {
        id: 'competitor-analysis',
        title: __('Competitor Analysis', 'beyondseo'),
        description: __('Track up to 5 competitors. See their strategies and outrank them.', 'beyondseo'),
        iconColor: '#2f8ee5',
        iconBackground: '#e8f3ff',
        iconName: IconNames.barChart,
    },
    {
        id: 'ai-features',
        title: __('AI Features', 'beyondseo'),
        description: __('Generate images, get content suggestions, and more. Let AI do the work.', 'beyondseo'),
        iconColor: '#7c4dff',
        iconBackground: '#f1e8ff',
        iconName: IconNames.ai,
    },
    {
        id: 'social',
        title: __('Social', 'beyondseo'),
        description: __('Create entire series of connected posts with AI. Build cohesive campaigns effortlessly.', 'beyondseo'),
        iconColor: '#12c2c2',
        iconBackground: '#e4f7f7',
        iconName: IconNames.socialMedia,
    },
];

export const freePlanFeatures: PlanFeature[] = [
    { text: __('BeyondSEO WordPress plugin (limited)', 'beyondseo'), checked: true },
    { text: __('Limited SEO features', 'beyondseo'), checked: false },
    { text: __('Track 3 keywords', 'beyondseo'), checked: false },
    { text: __('Profile publishing restricted to Facebook & Google', 'beyondseo'), checked: false },
    { text: __('No Google Ads', 'beyondseo'), checked: false },
    { text: __('No AI content series for social media', 'beyondseo'), checked: false },
    { text: __('Manual review replies', 'beyondseo'), checked: false },
    { text: __('No post boosting', 'beyondseo'), checked: false },
];

// Contact Sales Modal Configuration
export interface ContactSalesModalField {
    label: string;
    placeholder: string;
    required: boolean;
    maxLength?: number;
    options?: { value: string; label: string; }[];
}

export interface ContactSalesModalConfig {
    fields: {
        companyName: ContactSalesModalField;
        name: ContactSalesModalField;
        email: ContactSalesModalField;
        phoneNumber: ContactSalesModalField;
        industry: ContactSalesModalField;
        howDidYouFindUs: ContactSalesModalField;
        message: ContactSalesModalField;
    };
    checkboxText: string;
    submitButtonText: string;
}

export const contactSalesModalConfig: ContactSalesModalConfig = {
    fields: {
        companyName: {
            label: __('Company name', 'beyondseo'),
            placeholder: __('Your company name', 'beyondseo'),
            required: true,
        },
        name: {
            label: __('Name', 'beyondseo'),
            placeholder: __('Your full name', 'beyondseo'),
            required: true,
        },
        email: {
            label: __('Email', 'beyondseo'),
            placeholder: __('Your email address', 'beyondseo'),
            required: true,
        },
        phoneNumber: {
            label: __('Phone number', 'beyondseo'),
            placeholder: __('Enter your phone number', 'beyondseo'),
            required: false,
        },
        industry: {
            label: __('Industry', 'beyondseo'),
            placeholder: __('Industry', 'beyondseo'),
            required: false,
            options: [
                { value: 'technology', label: __('Technology', 'beyondseo') },
                { value: 'healthcare', label: __('Healthcare', 'beyondseo') },
                { value: 'finance', label: __('Finance', 'beyondseo') },
                { value: 'retail', label: __('Retail', 'beyondseo') },
                { value: 'education', label: __('Education', 'beyondseo') },
                { value: 'hospitality', label: __('Hospitality', 'beyondseo') },
                { value: 'real-estate', label: __('Real Estate', 'beyondseo') },
                { value: 'marketing', label: __('Marketing & Advertising', 'beyondseo') },
                { value: 'manufacturing', label: __('Manufacturing', 'beyondseo') },
                { value: 'other', label: __('Other', 'beyondseo') },
            ],
        },
        howDidYouFindUs: {
            label: __('How did you find us?', 'beyondseo'),
            placeholder: __('How did you find us?', 'beyondseo'),
            required: false,
            options: [
                { value: 'search-engine', label: __('Search Engine', 'beyondseo') },
                { value: 'social-media', label: __('Social Media', 'beyondseo') },
                { value: 'referral', label: __('Referral', 'beyondseo') },
                { value: 'advertisement', label: __('Advertisement', 'beyondseo') },
                { value: 'wordpress-plugin', label: __('WordPress Plugin Directory', 'beyondseo') },
                { value: 'blog-article', label: __('Blog/Article', 'beyondseo') },
                { value: 'other', label: __('Other', 'beyondseo') },
            ],
        },
        message: {
            label: __('Message', 'beyondseo'),
            placeholder: __('Enter your message', 'beyondseo'),
            required: true,
            maxLength: 400,
        },
    },
    checkboxText: __('I agree to receive other communications from RankingCoach 360.', 'beyondseo'),
    submitButtonText: __('Contact us', 'beyondseo'),
};
