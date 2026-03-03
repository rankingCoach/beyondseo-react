import {Domain} from '@models/swagger/BeyondSEO/Domain/Seo/Entities/Domains/Domain';
import {DomainValidation} from '@models/swagger/BeyondSEO/Domain/Seo/Entities/Domains/DomainValidation';
import {WebPageContent} from '@models/swagger/BeyondSEO/Domain/Seo/Entities/WebPages/WebPageContent';

  export const WebPageObjectType = {
    BeyondSEO_Domain_Seo_Entities_WebPages_WebPage : "BeyondSEO\\Domain\\Seo\\Entities\\WebPages\\WebPage",
  }

export type WebPage = {
  domain?: Domain
   /**
    * The full URL of the WebPage
    */
  url?: string
   /**
    * The relative path of the WebPage on its Domain
    */
  path?: string
   /**
    * Whether the domain requires https
    */
  needsHttps?: boolean
  valid?: DomainValidation
  content?: WebPageContent
   /**
    * The internal identifier of the entity
    */
  id?: number
   /**
    * The fully qualified class name of the object
    */
  objectType: typeof WebPageObjectType[keyof typeof WebPageObjectType] 
}
  
  