

  export const WPWebsiteDiscussionSettingObjectType = {
    App_Domain_Integrations_WordPress_Seo_Entities_Websites_Settings_WPWebsiteDiscussionSetting : "App\\Domain\\Integrations\\WordPress\\Seo\\Entities\\Websites\\Settings\\WPWebsiteDiscussionSetting",
  }

export type WPWebsiteDiscussionSetting = {
   /**
    * Default status for new comments (e.g., 'open' or 'closed'), or null if not set.
    */
  defaultCommentStatus?: string
   /**
    * List of moderation keywords for filtering comments, or null if not set.
    */
  moderationKeys?: string
   /**
    * Whether comment moderation is enabled ('1' for enabled, '0' for disabled), or null if not set.
    */
  commentModeration?: string
   /**
    * The fully qualified class name of the object
    */
  objectType: typeof WPWebsiteDiscussionSettingObjectType[keyof typeof WPWebsiteDiscussionSettingObjectType] 
}
  
  