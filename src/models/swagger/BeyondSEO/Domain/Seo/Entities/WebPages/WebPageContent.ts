import {Title} from '@models/swagger/BeyondSEO/Domain/Seo/Entities/WebPages/ContentElements/Title';
import {MetaDescription} from '@models/swagger/BeyondSEO/Domain/Seo/Entities/WebPages/ContentElements/MetaDescription';
import {Headings} from '@models/swagger/BeyondSEO/Domain/Seo/Entities/WebPages/ContentElements/Headings';
import {Links} from '@models/swagger/BeyondSEO/Domain/Seo/Entities/WebPages/ContentElements/Links';
import {MainContent} from '@models/swagger/BeyondSEO/Domain/Seo/Entities/WebPages/ContentElements/MainContent';

  export const WebPageContentObjectType = {
    BeyondSEO_Domain_Seo_Entities_WebPages_WebPageContent : "BeyondSEO\\Domain\\Seo\\Entities\\WebPages\\WebPageContent",
  }

export type WebPageContent = {
  title?: Title
  metaDescription?: MetaDescription
  headings?: Headings
  links?: Links
  mainContent?: MainContent
   /**
    * The fully qualified class name of the object
    */
  objectType: typeof WebPageContentObjectType[keyof typeof WebPageContentObjectType] 
}
  
  