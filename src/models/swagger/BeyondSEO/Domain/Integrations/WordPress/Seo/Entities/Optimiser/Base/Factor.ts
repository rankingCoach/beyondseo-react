import {Operations} from '@models/swagger/BeyondSEO/Domain/Integrations/WordPress/Seo/Entities/Optimiser/Base/Operations';
import {FactorSuggestions} from '@models/swagger/BeyondSEO/Domain/Integrations/WordPress/Seo/Entities/Optimiser/Base/FactorSuggestions';

  export const FactorObjectType = {
    BeyondSEO_Domain_Integrations_WordPress_Seo_Entities_Optimiser_Base_Factor : "BeyondSEO\\Domain\\Integrations\\WordPress\\Seo\\Entities\\Optimiser\\Base\\Factor",
  }

export type Factor = {
   /**
    * The unique identifier for this factor in the database
    */
  id?: number
   /**
    * The ID of the optimization context this factor belongs to
    */
  contextId?: number
   /**
    * The human-readable name of this factor
    */
  factorName?: string
   /**
    * Unique identifier key for this specific factor type
    */
  factorKey?: string
   /**
    * A description of this factor's purpose or function
    */
  description?: string
   /**
    * The importance weight of this factor in the overall score calculation
    */
  weight?: number
   /**
    * The calculated score for this factor (0-1 scale)
    */
  score?: number
   /**
    * Represents the status of a factor by score
    */
  status?: string
   /**
    * The ID of the WordPress post being analyzed
    */
  postId?: number
   /**
    * The ID of the SEO analysis this factor is part of
    */
  analysisId?: number
  operations?: Operations
  suggestions?: FactorSuggestions
   /**
    * Feature flags for this factor - exposed in JSON
    */
  featureFlags?: any []
   /**
    * The fully qualified class name of the object
    */
  objectType: typeof FactorObjectType[keyof typeof FactorObjectType] 
}
  
  