

  export const OperationObjectType = {
    App_Domain_Integrations_WordPress_Seo_Entities_Optimiser_Base_Operation : "App\\Domain\\Integrations\\WordPress\\Seo\\Entities\\Optimiser\\Base\\Operation",
  }

export type Operation = {
   /**
    * $id Database identifier for this operation
    */
  id?: number
   /**
    * $factorId ID of the parent SEO factor this operation belongs to
    */
  factorId?: number
   /**
    * $operationName Human-readable name of this operation
    */
  operationName?: string
   /**
    * $operationKey Unique identifier key for this operation type
    */
  operationKey?: string
   /**
    * $weight Relative importance of this operation within its parent factor (higher = more important)
    */
  weight?: number
   /**
    * $value The result from the `perform` method
    */
  value?: any []
   /**
    * $score Normalized score between 0.0-1.0 representing how well this aspect of SEO is optimized
    */
  score?: number
   /**
    * $suggestions List of suggestion types that should be triggered based on this operation's results
    */
  suggestions?: string []
   /**
    * The ID of the post/page being analyzed
    */
  postId?: number
   /**
    * Feature flags for this operation - exposed in JSON
    */
  featureFlags?: any []
   /**
    * The fully qualified class name of the object
    */
  objectType: typeof OperationObjectType[keyof typeof OperationObjectType] 
}
  
  