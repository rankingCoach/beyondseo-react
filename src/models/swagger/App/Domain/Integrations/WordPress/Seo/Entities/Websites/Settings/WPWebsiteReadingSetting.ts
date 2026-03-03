

  export const WPWebsiteReadingSettingObjectType = {
    App_Domain_Integrations_WordPress_Seo_Entities_Websites_Settings_WPWebsiteReadingSetting : "App\\Domain\\Integrations\\WordPress\\Seo\\Entities\\Websites\\Settings\\WPWebsiteReadingSetting",
  }

export type WPWebsiteReadingSetting = {
   /**
    * Determines what is displayed on the front page, or null if not set.
    */
  showOnFront?: string
   /**
    * ID or slug of the page set as the front page, or null if not set.
    */
  pageOnFront?: string
   /**
    * ID or slug of the page set for displaying posts, or null if not set.
    */
  pageForPosts?: string
   /**
    * Number of posts displayed per page, or null if not set.
    */
  postsPerPage?: string
   /**
    * The fully qualified class name of the object
    */
  objectType: typeof WPWebsiteReadingSettingObjectType[keyof typeof WPWebsiteReadingSettingObjectType] 
}
  
  