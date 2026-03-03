import {Capability} from '@models/swagger/App/Domain/Common/Entities/Capabilities/Capability';

  export const CapabilitiesObjectType = {
    App_Domain_Common_Entities_Capabilities_Capabilities : "App\\Domain\\Common\\Entities\\Capabilities\\Capabilities",
  }

export type Capabilities = {
  elements?: Capability []
   /**
    * The fully qualified class name of the object
    */
  objectType: typeof CapabilitiesObjectType[keyof typeof CapabilitiesObjectType] 
}
  
  