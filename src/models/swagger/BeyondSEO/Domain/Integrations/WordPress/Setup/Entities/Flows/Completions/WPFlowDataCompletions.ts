import {WPFlowDataCompletion} from '@models/swagger/BeyondSEO/Domain/Integrations/WordPress/Setup/Entities/Flows/Completions/WPFlowDataCompletion';

  export const WPFlowDataCompletionsObjectType = {
    BeyondSEO_Domain_Integrations_WordPress_Setup_Entities_Flows_Completions_WPFlowDataCompletions : "BeyondSEO\\Domain\\Integrations\\WordPress\\Setup\\Entities\\Flows\\Completions\\WPFlowDataCompletions",
  }

export type WPFlowDataCompletions = {
  elements?: WPFlowDataCompletion []
   /**
    * The fully qualified class name of the object
    */
  objectType: typeof WPFlowDataCompletionsObjectType[keyof typeof WPFlowDataCompletionsObjectType] 
}
  
  