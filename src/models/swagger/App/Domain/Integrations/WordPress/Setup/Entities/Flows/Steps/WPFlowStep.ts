import {WPFlowCollectors} from '@models/swagger/App/Domain/Integrations/WordPress/Setup/Entities/Flows/Collectors/WPFlowCollectors';
import {WPFlowDataCompletions} from '@models/swagger/App/Domain/Integrations/WordPress/Setup/Entities/Flows/Completions/WPFlowDataCompletions';
import {WPFlowQuestions} from '@models/swagger/App/Domain/Integrations/WordPress/Setup/Entities/Flows/Questions/WPFlowQuestions';
import {WPFlowQuestion} from '@models/swagger/App/Domain/Integrations/WordPress/Setup/Entities/Flows/Questions/WPFlowQuestion';

  export const WPFlowStepObjectType = {
    App_Domain_Integrations_WordPress_Setup_Entities_Flows_Steps_WPFlowStep : "App\\Domain\\Integrations\\WordPress\\Setup\\Entities\\Flows\\Steps\\WPFlowStep",
  }

export type WPFlowStep = {
   /**
    * The name of the FlowStep
    */
  step?: string
   /**
    * The requirements of the FlowStep
    */
  requirements?: string
   /**
    * The priority of the FlowStep
    */
  priority?: number
  collectors?: WPFlowCollectors
  completions?: WPFlowDataCompletions
  questions?: WPFlowQuestions
  currentQuestion?: WPFlowQuestion
   /**
    * $isFinalStep Is final step
    */
  isFinalStep?: boolean
   /**
    * The active status of the FlowStep
    */
  active?: boolean
   /**
    * The completion status
    */
  completed?: boolean
   /**
    * The user save count
    */
  userSaveCount?: number
   /**
    * The internal identifier of the entity
    */
  id?: number
   /**
    * The fully qualified class name of the object
    */
  objectType: typeof WPFlowStepObjectType[keyof typeof WPFlowStepObjectType] 
}
  
  