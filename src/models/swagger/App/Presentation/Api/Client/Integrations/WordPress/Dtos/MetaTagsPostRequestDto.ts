import {WPWebPageTitleMetaTag} from '@models/swagger/App/Domain/Integrations/WordPress/Seo/Entities/WebPages/Content/Elements/MetaTags/Tags/WPWebPageTitleMetaTag';
import {WPWebPageDescriptionMetaTag} from '@models/swagger/App/Domain/Integrations/WordPress/Seo/Entities/WebPages/Content/Elements/MetaTags/Tags/WPWebPageDescriptionMetaTag';
import {WPWebPageKeywordsMetaTag} from '@models/swagger/App/Domain/Integrations/WordPress/Seo/Entities/WebPages/Content/Elements/MetaTags/Tags/WPWebPageKeywordsMetaTag';

export type MetaTagsPostRequestDto = {
  title?: WPWebPageTitleMetaTag
  description?: WPWebPageDescriptionMetaTag
  keywords?: WPWebPageKeywordsMetaTag 
}
  
  