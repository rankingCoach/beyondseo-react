import {Factors} from '@models/swagger/BeyondSEO/Domain/Integrations/WordPress/Seo/Entities/Optimiser/Base/Factors';

  export const OptimiserContextObjectType = {
    BeyondSEO_Domain_Integrations_WordPress_Seo_Entities_Optimiser_Base_OptimiserContext : "BeyondSEO\\Domain\\Integrations\\WordPress\\Seo\\Entities\\Optimiser\\Base\\OptimiserContext",
  }

export type OptimiserContext = {
   /**
    * $id Database identifier for this context
    */
  id?: number
   /**
    * $analysisId Reference to the parent analysis run this context belongs to
    */
  analysisId?: number
   /**
    * $contextName Unique identifier key for this context (e.g., 'content_optimisation', 'technical_seo')
    */
  contextName?: string
   /**
    * $contextKey Unique identifier key for this context (e.g., 'content_optimisation', 'technical_seo')
    */
  contextKey?: string
   /**
    * $weight Relative importance of this context in the overall SEO score (higher = more important)
    */
  weight?: number
   /**
    * $score Calculated score for this context (0.0-1.0) representing the SEO performance for this area
    */
  score?: number
  factors?: Factors
   /**
    * Feature flags for this context - exposed in JSON
    */
  featureFlags?: any []
   /**
    * The fully qualified class name of the object
    */
  objectType: typeof OptimiserContextObjectType[keyof typeof OptimiserContextObjectType] 
}
  
  