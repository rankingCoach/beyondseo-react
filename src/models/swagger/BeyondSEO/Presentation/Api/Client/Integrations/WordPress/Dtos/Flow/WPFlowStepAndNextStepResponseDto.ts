import {WPFlowStep} from '@models/swagger/BeyondSEO/Domain/Integrations/WordPress/Setup/Entities/Flows/Steps/WPFlowStep';
import {WPFlowDataCompletion} from '@models/swagger/BeyondSEO/Domain/Integrations/WordPress/Setup/Entities/Flows/Completions/WPFlowDataCompletion';

export type WPFlowStepAndNextStepResponseDto = {
  step: WPFlowStep
  nextStep: WPFlowStep
   /**
    * $allStepsCompleted ALl steps completed flag
    */
  allStepsCompleted: boolean
   /**
    * $evaluationSucceeded Evaluation succeeded message
    */
  evaluationSucceeded?: string
   /**
    * $failedAPICallFromResult Failed API call from result message
    */
  failedAPICallFromResult?: string
  completion?: WPFlowDataCompletion 
}
  
  