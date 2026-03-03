import {WPFlowCollector} from '@models/swagger/App/Domain/Integrations/WordPress/Setup/Entities/Flows/Collectors/WPFlowCollector';

  export const WPFlowCollectorsObjectType = {
    App_Domain_Integrations_WordPress_Setup_Entities_Flows_Collectors_WPFlowCollectors : "App\\Domain\\Integrations\\WordPress\\Setup\\Entities\\Flows\\Collectors\\WPFlowCollectors",
  }

export type WPFlowCollectors = {
  elements?: WPFlowCollector []
   /**
    * The fully qualified class name of the object
    */
  objectType: typeof WPFlowCollectorsObjectType[keyof typeof WPFlowCollectorsObjectType] 
}
  
  