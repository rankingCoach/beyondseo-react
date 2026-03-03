import {Role} from '@models/swagger/DDD/Domain/Common/Entities/Roles/Role';

  export const RolesObjectType = {
    DDD_Domain_Common_Entities_Roles_Roles : "DDD\\Domain\\Common\\Entities\\Roles\\Roles",
  }

export type Roles = {
   /**
    * Whether the client is admin or not
    */
  isAdmin?: boolean
  elements?: Role []
   /**
    * The fully qualified class name of the object
    */
  objectType: typeof RolesObjectType[keyof typeof RolesObjectType] 
}
  
  