import {FactorSuggestion} from '@models/swagger/BeyondSEO/Domain/Integrations/WordPress/Seo/Entities/Optimiser/Base/FactorSuggestion';

  export const FactorSuggestionsObjectType = {
    BeyondSEO_Domain_Integrations_WordPress_Seo_Entities_Optimiser_Base_FactorSuggestions : "BeyondSEO\\Domain\\Integrations\\WordPress\\Seo\\Entities\\Optimiser\\Base\\FactorSuggestions",
  }

export type FactorSuggestions = {
  elements?: FactorSuggestion []
   /**
    * The fully qualified class name of the object
    */
  objectType: typeof FactorSuggestionsObjectType[keyof typeof FactorSuggestionsObjectType] 
}
  
  