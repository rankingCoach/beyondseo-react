import {WPWebPageTitleMetaTag} from '@models/swagger/BeyondSEO/Domain/Integrations/WordPress/Seo/Entities/WebPages/Content/Elements/MetaTags/Tags/WPWebPageTitleMetaTag';
import {WPWebPageDescriptionMetaTag} from '@models/swagger/BeyondSEO/Domain/Integrations/WordPress/Seo/Entities/WebPages/Content/Elements/MetaTags/Tags/WPWebPageDescriptionMetaTag';
import {WPWebPageKeywordsMetaTag} from '@models/swagger/BeyondSEO/Domain/Integrations/WordPress/Seo/Entities/WebPages/Content/Elements/MetaTags/Tags/WPWebPageKeywordsMetaTag';

export type MetaTagsGetResponseDto = {
  title?: WPWebPageTitleMetaTag
  description?: WPWebPageDescriptionMetaTag
  keywords?: WPWebPageKeywordsMetaTag 
}
  
  