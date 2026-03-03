

  export const FactorSuggestionObjectType = {
    App_Domain_Integrations_WordPress_Seo_Entities_Optimiser_Base_FactorSuggestion : "App\\Domain\\Integrations\\WordPress\\Seo\\Entities\\Optimiser\\Base\\FactorSuggestion",
  }

export type FactorSuggestion = {
   /**
    * $operationKey Reference to the SEO operation this suggestion belongs to
    */
  operationKey?: string
   /**
    * $title Short descriptive title of the suggestion
    */
  title?: string
   /**
    * $description Detailed explanation of what needs to be improved and how
    */
  description?: string
   /**
    * $priority Importance level of this suggestion (uses PRIORITY_* constants)
    */
  priority?: number
   /**
    * $activationThreshold Score threshold below which this suggestion is shown (0.0-1.0)
    */
  activationThreshold?: number
   /**
    * $issueType Categorization of the issue type (e.g., 'missing_primary_keyword', 'missing_meta_description')
    */
  issueType?: string
   /**
    * <string> $additionalInfo Supplementary contextual information or specific data related to the suggestion
    */
  additionalInfo?: any []
   /**
    * $displayConfig Configuration for the badge display, including color and label
    */
  displayConfig?: any []
   /**
    * The fully qualified class name of the object
    */
  objectType: typeof FactorSuggestionObjectType[keyof typeof FactorSuggestionObjectType] 
}
  
  