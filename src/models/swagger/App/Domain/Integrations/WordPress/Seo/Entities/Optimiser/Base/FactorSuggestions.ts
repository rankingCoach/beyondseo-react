import {FactorSuggestion} from '@models/swagger/App/Domain/Integrations/WordPress/Seo/Entities/Optimiser/Base/FactorSuggestion';

  export const FactorSuggestionsObjectType = {
    App_Domain_Integrations_WordPress_Seo_Entities_Optimiser_Base_FactorSuggestions : "App\\Domain\\Integrations\\WordPress\\Seo\\Entities\\Optimiser\\Base\\FactorSuggestions",
  }

export type FactorSuggestions = {
  elements?: FactorSuggestion []
   /**
    * The fully qualified class name of the object
    */
  objectType: typeof FactorSuggestionsObjectType[keyof typeof FactorSuggestionsObjectType] 
}
  
  