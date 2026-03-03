import {WPWebPageTitleMetaTag} from '@models/swagger/BeyondSEO/Domain/Integrations/WordPress/Seo/Entities/WebPages/Content/Elements/MetaTags/Tags/WPWebPageTitleMetaTag';
import {WPWebPageDescriptionMetaTag} from '@models/swagger/BeyondSEO/Domain/Integrations/WordPress/Seo/Entities/WebPages/Content/Elements/MetaTags/Tags/WPWebPageDescriptionMetaTag';
import {WPWebPageKeywordsMetaTag} from '@models/swagger/BeyondSEO/Domain/Integrations/WordPress/Seo/Entities/WebPages/Content/Elements/MetaTags/Tags/WPWebPageKeywordsMetaTag';

  export const WPWebPageContentMetaTagsObjectType = {
    BeyondSEO_Domain_Integrations_WordPress_Seo_Entities_WebPages_Content_WPWebPageContentMetaTags : "BeyondSEO\\Domain\\Integrations\\WordPress\\Seo\\Entities\\WebPages\\Content\\WPWebPageContentMetaTags",
  }

export type WPWebPageContentMetaTags = {
   /**
    * $postId The ID of the post that the content is for
    */
  postId?: number
  titleMetaTag?: WPWebPageTitleMetaTag
  descriptionMetaTag?: WPWebPageDescriptionMetaTag
  keywordsMetaTag?: WPWebPageKeywordsMetaTag
   /**
    * The fully qualified class name of the object
    */
  objectType: typeof WPWebPageContentMetaTagsObjectType[keyof typeof WPWebPageContentMetaTagsObjectType] 
}
  
  