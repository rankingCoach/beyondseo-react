import {WPWebPageSocialTitleMetaTag} from '@models/swagger/App/Domain/Integrations/WordPress/Seo/Entities/WebPages/Content/Elements/MetaTags/Social/WPWebPageSocialTitleMetaTag';
import {WPWebPageSocialDescriptionMetaTag} from '@models/swagger/App/Domain/Integrations/WordPress/Seo/Entities/WebPages/Content/Elements/MetaTags/Social/WPWebPageSocialDescriptionMetaTag';

export type SocialMetaTagsPostRequestDto = {
  title?: WPWebPageSocialTitleMetaTag
  description?: WPWebPageSocialDescriptionMetaTag
   /**
    * $selectedImageSource The selected image source identifier
    */
  selectedImageSource?: string 
}
  
  