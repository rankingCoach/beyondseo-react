import {WPRequirement} from '@models/swagger/App/Domain/Integrations/WordPress/Setup/Entities/Flows/Requirements/WPRequirement';

  export const WPRequirementsObjectType = {
    App_Domain_Integrations_WordPress_Setup_Entities_Flows_Requirements_WPRequirements : "App\\Domain\\Integrations\\WordPress\\Setup\\Entities\\Flows\\Requirements\\WPRequirements",
  }

export type WPRequirements = {
  elements?: WPRequirement []
   /**
    * The fully qualified class name of the object
    */
  objectType: typeof WPRequirementsObjectType[keyof typeof WPRequirementsObjectType] 
}
  
  