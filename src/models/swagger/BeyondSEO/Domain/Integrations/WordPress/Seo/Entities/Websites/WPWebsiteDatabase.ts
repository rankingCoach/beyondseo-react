

  export const WPWebsiteDatabaseObjectType = {
    BeyondSEO_Domain_Integrations_WordPress_Seo_Entities_Websites_WPWebsiteDatabase : "BeyondSEO\\Domain\\Integrations\\WordPress\\Seo\\Entities\\Websites\\WPWebsiteDatabase",
  }

export type WPWebsiteDatabase = {
   /**
    * $tables The database host
    */
  tables?: string []
  size?: string
   /**
    * The fully qualified class name of the object
    */
  objectType: typeof WPWebsiteDatabaseObjectType[keyof typeof WPWebsiteDatabaseObjectType] 
}
  
  