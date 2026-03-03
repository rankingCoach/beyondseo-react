

  export const WPLegacyAccountSettingObjectType = {
    BeyondSEO_Domain_Integrations_WordPress_Common_Entities_Accounts_Legacy_Settings_WPLegacyAccountSetting : "BeyondSEO\\Domain\\Integrations\\WordPress\\Common\\Entities\\Accounts\\Legacy\\Settings\\WPLegacyAccountSetting",
  }

export type WPLegacyAccountSetting = {
   /**
    * $umetaId The ID of the user meta.
    */
  umetaId?: number
   /**
    * $accountId The ID of the user account.
    */
  accountId?: number
   /**
    * $metaKey The key of the user meta.
    */
  metaKey?: string
   /**
    * $metaValue The value of the user meta.
    */
  metaValue?: object
   /**
    * The fully qualified class name of the object
    */
  objectType: typeof WPLegacyAccountSettingObjectType[keyof typeof WPLegacyAccountSettingObjectType] 
}
  
  