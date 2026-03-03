

  export const WPVariableObjectType = {
    BeyondSEO_Domain_Integrations_WordPress_Common_Entities_WPVariable : "BeyondSEO\\Domain\\Integrations\\WordPress\\Common\\Entities\\WPVariable",
  }

export type WPVariable = {
  post_id?: number
  key?: string
  value?: string
  type?: string
   /**
    * The fully qualified class name of the object
    */
  objectType: typeof WPVariableObjectType[keyof typeof WPVariableObjectType] 
}
  
  