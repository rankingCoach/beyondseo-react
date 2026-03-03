import {WPLegacyAccountSetting} from '@models/swagger/App/Domain/Integrations/WordPress/Common/Entities/Accounts/Legacy/Settings/WPLegacyAccountSetting';

  export const WPLegacyAccountSettingsObjectType = {
    App_Domain_Integrations_WordPress_Common_Entities_Accounts_Legacy_Settings_WPLegacyAccountSettings : "App\\Domain\\Integrations\\WordPress\\Common\\Entities\\Accounts\\Legacy\\Settings\\WPLegacyAccountSettings",
  }

export type WPLegacyAccountSettings = {
  settings?: object
  elements?: WPLegacyAccountSetting []
   /**
    * The fully qualified class name of the object
    */
  objectType: typeof WPLegacyAccountSettingsObjectType[keyof typeof WPLegacyAccountSettingsObjectType] 
}
  
  