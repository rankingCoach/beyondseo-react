import {WPFlowStep} from '@models/swagger/App/Domain/Integrations/WordPress/Setup/Entities/Flows/Steps/WPFlowStep';
import {WPFlowDataCompletions} from '@models/swagger/App/Domain/Integrations/WordPress/Setup/Entities/Flows/Completions/WPFlowDataCompletions';

  export const WPFlowQuestionObjectType = {
    App_Domain_Integrations_WordPress_Setup_Entities_Flows_Questions_WPFlowQuestion : "App\\Domain\\Integrations\\WordPress\\Setup\\Entities\\Flows\\Questions\\WPFlowQuestion",
  }

export type WPFlowQuestion = {
   /**
    * ID of the parent question (for follow-up questions)
    */
  parentId?: number
   /**
    * The ID of the flow step this question belongs to
    */
  stepId?: number
  step?: WPFlowStep
   /**
    * The text of the question
    */
  question?: string
   /**
    * The sequence order of the question within the step
    */
  sequence?: number
   /**
    * Context information for AI evaluation
    */
  aiContext?: string
   /**
    * Whether this is an AI-generated follow-up question
    */
  isAiGenerated?: boolean
  completions?: WPFlowDataCompletions
   /**
    * The internal identifier of the entity
    */
  id?: number
   /**
    * The fully qualified class name of the object
    */
  objectType: typeof WPFlowQuestionObjectType[keyof typeof WPFlowQuestionObjectType] 
}
  
  