import {WPVariable} from '@models/swagger/BeyondSEO/Domain/Integrations/WordPress/Common/Entities/WPVariable';

  export const WPVariablesObjectType = {
    BeyondSEO_Domain_Integrations_WordPress_Common_Entities_WPVariables : "BeyondSEO\\Domain\\Integrations\\WordPress\\Common\\Entities\\WPVariables",
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
  
  