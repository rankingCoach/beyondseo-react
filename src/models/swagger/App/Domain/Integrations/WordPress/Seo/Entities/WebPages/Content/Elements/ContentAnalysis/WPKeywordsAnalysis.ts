import {WPPrimaryKeyword} from '@models/swagger/App/Domain/Integrations/WordPress/Seo/Entities/WebPages/Content/Elements/ContentAnalysis/Keywords/WPPrimaryKeyword';
import {WPAdditionalKeywords} from '@models/swagger/App/Domain/Integrations/WordPress/Seo/Entities/WebPages/Content/Elements/ContentAnalysis/Keywords/WPAdditionalKeywords';
import {Keywords} from '@models/swagger/App/Domain/Common/Entities/Keywords/Keywords';

  export const WPKeywordsAnalysisObjectType = {
    App_Domain_Integrations_WordPress_Seo_Entities_WebPages_Content_Elements_ContentAnalysis_WPKeywordsAnalysis : "App\\Domain\\Integrations\\WordPress\\Seo\\Entities\\WebPages\\Content\\Elements\\ContentAnalysis\\WPKeywordsAnalysis",
  }

export type WPKeywordsAnalysis = {
  primaryKeywordFromExisting?: WPPrimaryKeyword
  primaryKeywordFromContent?: WPPrimaryKeyword
  additionalKeywordsFromExisting?: WPAdditionalKeywords
  additionalKeywordsFromContent?: WPAdditionalKeywords
  existingKeywords?: Keywords
   /**
    * The fully qualified class name of the object
    */
  objectType: typeof WPKeywordsAnalysisObjectType[keyof typeof WPKeywordsAnalysisObjectType] 
}
  
  