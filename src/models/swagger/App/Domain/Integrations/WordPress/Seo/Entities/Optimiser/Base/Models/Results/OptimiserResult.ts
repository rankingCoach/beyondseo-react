import {OptimiserContexts} from '@models/swagger/App/Domain/Integrations/WordPress/Seo/Entities/Optimiser/Base/OptimiserContexts';
import {FactorSuggestions} from '@models/swagger/App/Domain/Integrations/WordPress/Seo/Entities/Optimiser/Base/FactorSuggestions';
import {CategorizedSuggestions} from '@models/swagger/App/Domain/Integrations/WordPress/Seo/Entities/Optimiser/Base/CategorizedSuggestions';

  export const OptimiserResultObjectType = {
    App_Domain_Integrations_WordPress_Seo_Entities_Optimiser_Base_Models_Results_OptimiserResult : "App\\Domain\\Integrations\\WordPress\\Seo\\Entities\\Optimiser\\Base\\Models\\Results\\OptimiserResult",
  }

export type OptimiserResult = {
   /**
    * The overall score of the SEO analysis
    */
  score?: number
  contexts?: OptimiserContexts
  topSuggestions?: FactorSuggestions
  categorizedSuggestions?: CategorizedSuggestions
   /**
    * The total number of unique suggestions
    */
  totalSuggestionsCount?: number
   /**
    * The date and time when the analysis was performed
    */
  analyzedAt?: string
   /**
    * <string> The URLs that were consumed during the analysis
    */
  urlsConsumed?: any []
   /**
    * <string, mixed> The post data
    */
  post?: any []
   /**
    * The fully qualified class name of the object
    */
  objectType: typeof OptimiserResultObjectType[keyof typeof OptimiserResultObjectType] 
}
  
  