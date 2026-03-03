import {WPWebPageSetting} from '@models/swagger/BeyondSEO/Domain/Integrations/WordPress/Seo/Entities/WebPages/Settings/WPWebPageSetting';

  export const WPWebPageSettingsObjectType = {
    BeyondSEO_Domain_Integrations_WordPress_Seo_Entities_WebPages_Settings_WPWebPageSettings : "BeyondSEO\\Domain\\Integrations\\WordPress\\Seo\\Entities\\WebPages\\Settings\\WPWebPageSettings",
  }

export type WPWebPageSettings = {
  elements?: WPWebPageSetting []
   /**
    * The fully qualified class name of the object
    */
  objectType: typeof WPWebPageSettingsObjectType[keyof typeof WPWebPageSettingsObjectType] 
}
  
  