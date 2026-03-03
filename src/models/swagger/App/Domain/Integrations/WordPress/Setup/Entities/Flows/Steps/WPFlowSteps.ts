import {WPFlowStep} from '@models/swagger/App/Domain/Integrations/WordPress/Setup/Entities/Flows/Steps/WPFlowStep';

  export const WPFlowStepsObjectType = {
    App_Domain_Integrations_WordPress_Setup_Entities_Flows_Steps_WPFlowSteps : "App\\Domain\\Integrations\\WordPress\\Setup\\Entities\\Flows\\Steps\\WPFlowSteps",
  }

export type WPFlowSteps = {
  elements?: WPFlowStep []
   /**
    * The fully qualified class name of the object
    */
  objectType: typeof WPFlowStepsObjectType[keyof typeof WPFlowStepsObjectType] 
}
  
  