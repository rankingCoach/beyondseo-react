import { __ } from "@wordpress/i18n";
import BannerFreeImage from "@assets/banner_seo_wp_free.svg";
import BannerStandardImage from "@assets/banner_seo_wp_standard.svg";
import BannerAdvancedImage from "@assets/banner_seo_wp_advanced.svg";

export interface BannerConfig {
  show: boolean;
  title: string;
  description: string;
  features: string[];
  imageSrc: string;
  andMoreText: string;
  buttonText: string;
}

export const getBannerConfig = (planType: string): BannerConfig => {
  switch (planType) {
    case "seo_wp_free":
      return {
        show: true,
        title: __("Why take 46 steps when one click gets you there?", "beyondseo"),
        description: __(
          "It takes only one click to publish your business in 46 directories, and along with that, you get features that help you automate repetitive tasks with AI, launch a Google ads campaign, and more. See how our plans can help you grow and stand out faster.",
          "beyondseo",
        ),
        features: [
        ],
        imageSrc: BannerFreeImage,
        andMoreText: "",
        buttonText: __("See how to stand out", "beyondseo"),
      };
    case "seo_wp_standard":
      return {
        show: true,
        title: __("One bad review can drop customers' trust by 42%.", "beyondseo"),
        description: __(
          "That’s not just feedback, it’s lost revenue.",
          "beyondseo",
        ),
        features: [
          __("Every review shapes how you're seen", "beyondseo"),
          __("Every slow reply signals a lack of care", "beyondseo"),
          __("Every unanswered review weakens trust", "beyondseo"),
        ],
        imageSrc: BannerStandardImage,
        andMoreText: __("The Advanced plan helps you with every part of your reputation and more.", "beyondseo"),
        buttonText: __("See how to build trust", "beyondseo"),
      };
    case "seo_wp_advanced":
      return {
        show: true,
        title: __("Social Media seems like a chore, but it pays off more than you’d think.", "beyondseo"),
        description: __(
          "If maintaining your social media keeps eating up your time, you’re not alone. Many business owners want the same thing:",
          "beyondseo",
        ),
        features: [
          __("Stop forgetting to post regularly", "beyondseo"),
          __("Stop writing the same post 5 times", "beyondseo"),
          __("Stop taking from your free time", "beyondseo"),
        ],
        imageSrc: BannerAdvancedImage,
        andMoreText: __("The Social add-on takes the pressure off and can help turn your social platforms into real gains.", "beyondseo"),
        buttonText: __("Add Social Features", "beyondseo"),
      };
    default:
      return {
        show: false,
        title: "",
        description: "",
        features: [],
        imageSrc: "",
        andMoreText: "",
        buttonText: "",
      };
  }
};
