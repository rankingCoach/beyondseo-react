

  export const CapabilityObjectType = {
    BeyondSEO_Domain_Common_Entities_Capabilities_Capability : "BeyondSEO\\Domain\\Common\\Entities\\Capabilities\\Capability",
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
  
  