

  export const WPWebsiteGeneralSettingObjectType = {
    BeyondSEO_Domain_Integrations_WordPress_Seo_Entities_Websites_Settings_WPWebsiteGeneralSetting : "BeyondSEO\\Domain\\Integrations\\WordPress\\Seo\\Entities\\Websites\\Settings\\WPWebsiteGeneralSetting",
  }

export type WPWebsiteGeneralSetting = {
   /**
    * User's preferred timezone, or null if not set.
    */
  timezone?: string
   /**
    * Defines the first day of the week, or null if not set.
    */
  startOfWeek?: string
   /**
    * User's preferred date format, or null if not set.
    */
  dateFormat?: string
   /**
    * User's preferred time format, or null if not set.
    */
  timeFormat?: string
   /**
    * The fully qualified class name of the object
    */
  objectType: typeof WPWebsiteGeneralSettingObjectType[keyof typeof WPWebsiteGeneralSettingObjectType] 
}
  
  