import {WPAccount} from '@models/swagger/App/Domain/Integrations/WordPress/Common/Entities/Accounts/WPAccount';

  export const WPSetupObjectType = {
    App_Domain_Integrations_WordPress_Setup_Entities_WPSetup : "App\\Domain\\Integrations\\WordPress\\Setup\\Entities\\WPSetup",
  }

export type WPSetup = {
   /**
    * $isPluginOnboarded Is the internal onboarding completed
    */
  isPluginOnboarded?: boolean
   /**
    * $lastPluginUpdate The last internal onboarding update
    */
  lastPluginUpdate?: number
   /**
    * $isApplicationOnboarded Is the external onboarding completed
    */
  isApplicationOnboarded?: boolean
   /**
    * $lastApplicationUpdate The last external onboarding update
    */
  lastApplicationUpdate?: number
  account?: WPAccount
   /**
    * The fully qualified class name of the object
    */
  objectType: typeof WPSetupObjectType[keyof typeof WPSetupObjectType] 
}
  
  