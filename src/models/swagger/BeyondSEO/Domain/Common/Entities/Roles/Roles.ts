import {Role} from '@models/swagger/BeyondSEO/Domain/Common/Entities/Roles/Role';

  export const RolesObjectType = {
    BeyondSEO_Domain_Common_Entities_Roles_Roles : "BeyondSEO\\Domain\\Common\\Entities\\Roles\\Roles",
  }

export type Roles = {
  elements?: Role []
   /**
    * Whether the client is admin or not
    */
  isAdmin?: boolean
   /**
    * The fully qualified class name of the object
    */
  objectType: typeof RolesObjectType[keyof typeof RolesObjectType] 
}
  
  