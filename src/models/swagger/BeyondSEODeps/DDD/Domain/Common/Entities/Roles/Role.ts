

  export const RoleObjectType = {
    BeyondSEODeps_DDD_Domain_Common_Entities_Roles_Role : "BeyondSEODeps\\DDD\\Domain\\Common\\Entities\\Roles\\Role",
  }

export type Role = {
   /**
    * The name of the role
    */
  name?: string
   /**
    * The description of the role
    */
  description?: string
   /**
    * Whether the role is an admin role or not
    */
  isAdminRole?: boolean
   /**
    * The internal identifier of the entity
    */
  id?: number
   /**
    * The fully qualified class name of the object
    */
  objectType: typeof RoleObjectType[keyof typeof RoleObjectType] 
}
  
  