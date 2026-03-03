import {WebPage} from '@models/swagger/App/Domain/Seo/Entities/WebPages/WebPage';

  export const WebPagesObjectType = {
    App_Domain_Seo_Entities_WebPages_WebPages : "App\\Domain\\Seo\\Entities\\WebPages\\WebPages",
  }

export type WebPages = {
  elements?: WebPage []
   /**
    * The fully qualified class name of the object
    */
  objectType: typeof WebPagesObjectType[keyof typeof WebPagesObjectType] 
}
  
  