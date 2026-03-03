import {WPVariable} from '@models/swagger/App/Domain/Integrations/WordPress/Common/Entities/WPVariable';

  export const WPVariablesObjectType = {
    App_Domain_Integrations_WordPress_Common_Entities_WPVariables : "App\\Domain\\Integrations\\WordPress\\Common\\Entities\\WPVariables",
  }

export type WPVariables = {
   /**
    * $elements The variables
    */
  elements?: WPVariable []
   /**
    * The fully qualified class name of the object
    */
  objectType: typeof WPVariablesObjectType[keyof typeof WPVariablesObjectType] 
}
  
  