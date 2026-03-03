import {WPKeyword} from '@models/swagger/App/Domain/Integrations/WordPress/Seo/Entities/WebPages/Content/Elements/ContentAnalysis/Keywords/WPKeyword';

  export const WPKeywordsObjectType = {
    App_Domain_Integrations_WordPress_Seo_Entities_WebPages_Content_Elements_ContentAnalysis_Keywords_WPKeywords : "App\\Domain\\Integrations\\WordPress\\Seo\\Entities\\WebPages\\Content\\Elements\\ContentAnalysis\\Keywords\\WPKeywords",
  }

export type WPKeywords = {
  elements?: WPKeyword []
   /**
    * The fully qualified class name of the object
    */
  objectType: typeof WPKeywordsObjectType[keyof typeof WPKeywordsObjectType] 
}
  
  