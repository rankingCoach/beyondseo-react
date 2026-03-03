import {WPWebsite} from '@models/swagger/App/Domain/Integrations/WordPress/Seo/Entities/Websites/WPWebsite';
import {WPSetup} from '@models/swagger/App/Domain/Integrations/WordPress/Setup/Entities/WPSetup';

  export const WPPluginObjectType = {
    App_Domain_Integrations_WordPress_Plugin_Entities_WPPlugin : "App\\Domain\\Integrations\\WordPress\\Plugin\\Entities\\WPPlugin",
  }

export type WPPlugin = {
   /**
    * $name The version of the plugin
    */
  version?: string
   /**
    * $settings
    */
  settings?: object
  website?: WPWebsite
  setupData?: WPSetup
   /**
    * $installedAt Time when the RC plugin was installed
    */
  installedAt?: string
   /**
    * $installedDateTime Time when the RC plugin was installed
    */
  installedDateTime?: string
   /**
    * $installationHash Hash of the installation
    */
  installationHash?: string
   /**
    * $debugData Debug data for the plugin
    */
  debugData?: object
   /**
    * The fully qualified class name of the object
    */
  objectType: typeof WPPluginObjectType[keyof typeof WPPluginObjectType] 
}
  
  