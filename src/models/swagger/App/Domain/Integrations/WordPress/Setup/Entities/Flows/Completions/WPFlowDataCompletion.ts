import {WPFlowStep} from '@models/swagger/App/Domain/Integrations/WordPress/Setup/Entities/Flows/Steps/WPFlowStep';
import {WPFlowCollector} from '@models/swagger/App/Domain/Integrations/WordPress/Setup/Entities/Flows/Collectors/WPFlowCollector';
import {WPFlowQuestion} from '@models/swagger/App/Domain/Integrations/WordPress/Setup/Entities/Flows/Questions/WPFlowQuestion';
import {WPFlowEvaluateData} from '@models/swagger/App/Domain/Integrations/WordPress/Setup/Entities/Flows/Completions/WPFlowEvaluateData';

  export const WPFlowDataCompletionObjectType = {
    App_Domain_Integrations_WordPress_Setup_Entities_Flows_Completions_WPFlowDataCompletion : "App\\Domain\\Integrations\\WordPress\\Setup\\Entities\\Flows\\Completions\\WPFlowDataCompletion",
  }

export type WPFlowDataCompletion = {
   /**
    * The id of the FlowStep
    */
  stepId?: number
  step?: WPFlowStep
   /**
    * The id of the FlowCollector
    */
  collectorId?: number
  collector?: WPFlowCollector
   /**
    * The ID of the question being answered
    */
  questionId?: number
  question?: WPFlowQuestion
   /**
    * The answer
    */
  answer?: string
  data?: WPFlowEvaluateData
   /**
    * The time of completion
    */
  timeOfCompletion?: number
   /**
    * The completion status
    */
  isCompleted?: boolean
   /**
    * The internal identifier of the entity
    */
  id?: number
   /**
    * The fully qualified class name of the object
    */
  objectType: typeof WPFlowDataCompletionObjectType[keyof typeof WPFlowDataCompletionObjectType] 
}
  
  