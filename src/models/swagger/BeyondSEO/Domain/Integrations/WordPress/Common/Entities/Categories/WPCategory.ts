

  export const WPCategoryObjectType = {
    BeyondSEO_Domain_Integrations_WordPress_Common_Entities_Categories_WPCategory : "BeyondSEO\\Domain\\Integrations\\WordPress\\Common\\Entities\\Categories\\WPCategory",
  }

export type WPCategory = {
   /**
    * ID of the local db Category
    */
  id?: number
   /**
    * categoryId in rC
    */
  categoryId?: number
   /**
    * name on rC
    */
  name?: string
   /**
    * alias on rC
    */
  externalId?: string
   /**
    * The fully qualified class name of the object
    */
  objectType: typeof WPCategoryObjectType[keyof typeof WPCategoryObjectType] 
}
  
  