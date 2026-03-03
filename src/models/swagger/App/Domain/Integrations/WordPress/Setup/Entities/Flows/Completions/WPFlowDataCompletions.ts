import {WPFlowDataCompletion} from '@models/swagger/App/Domain/Integrations/WordPress/Setup/Entities/Flows/Completions/WPFlowDataCompletion';

  export const WPFlowDataCompletionsObjectType = {
    App_Domain_Integrations_WordPress_Setup_Entities_Flows_Completions_WPFlowDataCompletions : "App\\Domain\\Integrations\\WordPress\\Setup\\Entities\\Flows\\Completions\\WPFlowDataCompletions",
  }

export type WPFlowDataCompletions = {
  elements?: WPFlowDataCompletion []
   /**
    * The fully qualified class name of the object
    */
  objectType: typeof WPFlowDataCompletionsObjectType[keyof typeof WPFlowDataCompletionsObjectType] 
}
  
  