

  export const WPWebPageSettingObjectType = {
    App_Domain_Integrations_WordPress_Seo_Entities_WebPages_Settings_WPWebPageSetting : "App\\Domain\\Integrations\\WordPress\\Seo\\Entities\\WebPages\\Settings\\WPWebPageSetting",
  }

export type WPWebPageSetting = {
   /**
    * $umetaId The ID of the content meta.
    */
  cmetaId?: number
   /**
    * $contentId The ID of the content.
    */
  contentId?: number
   /**
    * $metaKey The key of the content meta.
    */
  metaKey?: string
   /**
    * $metaValue The value of the content meta.
    */
  metaValue?: object
   /**
    * $uniqueKey The unique key of the content meta.
    */
  uniqueKey?: string
   /**
    * The fully qualified class name of the object
    */
  objectType: typeof WPWebPageSettingObjectType[keyof typeof WPWebPageSettingObjectType] 
}
  
  