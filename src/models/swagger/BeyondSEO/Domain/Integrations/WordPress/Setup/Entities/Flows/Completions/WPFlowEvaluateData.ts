

  export const WPFlowEvaluateDataObjectType = {
    BeyondSEO_Domain_Integrations_WordPress_Setup_Entities_Flows_Completions_WPFlowEvaluateData : "BeyondSEO\\Domain\\Integrations\\WordPress\\Setup\\Entities\\Flows\\Completions\\WPFlowEvaluateData",
  }

export type WPFlowEvaluateData = {
   /**
    * The language being evaluated
    */
  language?: string
   /**
    * Whether the answer has been evaluated by AI
    */
  isEvaluated?: boolean
   /**
    * The result of the AI evaluation
    */
  evaluationResult?: boolean
   /**
    * AI-generated feedback about the answer
    */
  evaluationFeedback?: string
   /**
    * Raw data from the AI evaluation
    */
  evaluationRawAIResult?: string
   /**
    * Raw data from the AI prompt used for evaluation
    */
  evaluationRawAIPrompt?: string
   /**
    * Additional flow-specific metadata
    */
  metadata?: any []
   /**
    * The postal address of the business
    */
  postalAddress?: string
   /**
    * The fully qualified class name of the object
    */
  objectType: typeof WPFlowEvaluateDataObjectType[keyof typeof WPFlowEvaluateDataObjectType] 
}
  
  