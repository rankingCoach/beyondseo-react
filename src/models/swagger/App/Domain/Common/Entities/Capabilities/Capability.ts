

  export const CapabilityObjectType = {
    App_Domain_Common_Entities_Capabilities_Capability : "App\\Domain\\Common\\Entities\\Capabilities\\Capability",
  }

export type Capability = {
   /**
    * Capability name.
    */
  name?: string
   /**
    * The internal identifier of the entity
    */
  id?: number
   /**
    * The fully qualified class name of the object
    */
  objectType: typeof CapabilityObjectType[keyof typeof CapabilityObjectType] 
}
  
  