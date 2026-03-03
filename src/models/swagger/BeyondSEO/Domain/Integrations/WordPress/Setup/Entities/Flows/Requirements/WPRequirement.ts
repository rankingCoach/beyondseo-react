

  export const WPRequirementObjectType = {
    BeyondSEO_Domain_Integrations_WordPress_Setup_Entities_Flows_Requirements_WPRequirement : "BeyondSEO\\Domain\\Integrations\\WordPress\\Setup\\Entities\\Flows\\Requirements\\WPRequirement",
  }

export type WPRequirement = {
   /**
    * ID of the Requirement
    */
  id?: number
   /**
    * Name of the requirement
    */
  setupRequirement?: string
   /**
    * Alias of the requirement on rC
    */
  entityAlias?: string
   /**
    * Value of the requirement
    */
  value?: string
   /**
    * The fully qualified class name of the object
    */
  objectType: typeof WPRequirementObjectType[keyof typeof WPRequirementObjectType] 
}
  
  