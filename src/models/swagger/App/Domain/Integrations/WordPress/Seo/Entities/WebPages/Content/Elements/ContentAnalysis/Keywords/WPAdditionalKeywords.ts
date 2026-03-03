import {Keyword} from '@models/swagger/App/Domain/Common/Entities/Keywords/Keyword';

  export const WPAdditionalKeywordsObjectType = {
    App_Domain_Integrations_WordPress_Seo_Entities_WebPages_Content_Elements_ContentAnalysis_Keywords_WPAdditionalKeywords : "App\\Domain\\Integrations\\WordPress\\Seo\\Entities\\WebPages\\Content\\Elements\\ContentAnalysis\\Keywords\\WPAdditionalKeywords",
  }

export type WPAdditionalKeywords = {
   /**
    * $elements
    */
  elements?: Keyword []
   /**
    * The fully qualified class name of the object
    */
  objectType: typeof WPAdditionalKeywordsObjectType[keyof typeof WPAdditionalKeywordsObjectType] 
}
  
  