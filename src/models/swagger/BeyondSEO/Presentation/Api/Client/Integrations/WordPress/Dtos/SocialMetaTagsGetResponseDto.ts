import {WPWebPageSocialTitleMetaTag} from '@models/swagger/BeyondSEO/Domain/Integrations/WordPress/Seo/Entities/WebPages/Content/Elements/MetaTags/Social/WPWebPageSocialTitleMetaTag';
import {WPWebPageSocialDescriptionMetaTag} from '@models/swagger/BeyondSEO/Domain/Integrations/WordPress/Seo/Entities/WebPages/Content/Elements/MetaTags/Social/WPWebPageSocialDescriptionMetaTag';

export type SocialMetaTagsGetResponseDto = {
  social_title?: WPWebPageSocialTitleMetaTag
  social_description?: WPWebPageSocialDescriptionMetaTag
   /**
    * $selected_image_source The selected image source identifier
    */
  selected_image_source?: string
   /**
    * $selected_image_url The URL of the selected image
    */
  selected_image_url?: string 
}
  
  