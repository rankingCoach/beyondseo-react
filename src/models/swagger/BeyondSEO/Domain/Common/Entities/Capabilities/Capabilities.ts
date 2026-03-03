import {Capability} from '@models/swagger/BeyondSEO/Domain/Common/Entities/Capabilities/Capability';

  export const CapabilitiesObjectType = {
    BeyondSEO_Domain_Common_Entities_Capabilities_Capabilities : "BeyondSEO\\Domain\\Common\\Entities\\Capabilities\\Capabilities",
  }

export type Capabilities = {
  elements?: Capability []
   /**
    * The fully qualified class name of the object
    */
  objectType: typeof CapabilitiesObjectType[keyof typeof CapabilitiesObjectType] 
}
  
  