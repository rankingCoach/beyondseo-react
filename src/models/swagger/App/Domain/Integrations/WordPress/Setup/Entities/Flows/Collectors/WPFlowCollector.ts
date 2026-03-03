import {WPFlowSteps} from '@models/swagger/App/Domain/Integrations/WordPress/Setup/Entities/Flows/Steps/WPFlowSteps';

  export const WPFlowCollectorObjectType = {
    App_Domain_Integrations_WordPress_Setup_Entities_Flows_Collectors_WPFlowCollector : "App\\Domain\\Integrations\\WordPress\\Setup\\Entities\\Flows\\Collectors\\WPFlowCollector",
  }

export type WPFlowCollector = {
   /**
    * The name of the FlowCollector
    */
  collector?: string
   /**
    * The settings of the FlowCollector
    */
  settings?: any []
   /**
    * The class name of the FlowCollector
    */
  className?: string
   /**
    * The priority of the FlowCollector
    */
  priority?: number
   /**
    * The active status of the FlowCollector
    */
  active?: boolean
  steps?: WPFlowSteps
   /**
    * Whether this requirement should be saved in setup or not
    */
  saveCollectedData?: boolean
   /**
    * The internal identifier of the entity
    */
  id?: number
   /**
    * The fully qualified class name of the object
    */
  objectType: typeof WPFlowCollectorObjectType[keyof typeof WPFlowCollectorObjectType] 
}
  
  