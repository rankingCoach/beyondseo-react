import {WebPage} from '@models/swagger/BeyondSEO/Domain/Seo/Entities/WebPages/WebPage';

  export const WebPagesObjectType = {
    BeyondSEO_Domain_Seo_Entities_WebPages_WebPages : "BeyondSEO\\Domain\\Seo\\Entities\\WebPages\\WebPages",
  }

export type WebPages = {
  elements?: WebPage []
   /**
    * The fully qualified class name of the object
    */
  objectType: typeof WebPagesObjectType[keyof typeof WebPagesObjectType] 
}
  
  