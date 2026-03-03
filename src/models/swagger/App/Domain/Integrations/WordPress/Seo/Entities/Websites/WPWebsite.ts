import {WPWebsiteSetting} from '@models/swagger/App/Domain/Integrations/WordPress/Seo/Entities/Websites/WPWebsiteSetting';
import {WPWebsiteDatabase} from '@models/swagger/App/Domain/Integrations/WordPress/Seo/Entities/Websites/WPWebsiteDatabase';
import {Domain} from '@models/swagger/App/Domain/Seo/Entities/Domains/Domain';
import {CMSType} from '@models/swagger/App/Domain/Seo/Entities/CMSTypes/CMSType';

  export const WPWebsiteObjectType = {
    App_Domain_Integrations_WordPress_Seo_Entities_Websites_WPWebsite : "App\\Domain\\Integrations\\WordPress\\Seo\\Entities\\Websites\\WPWebsite",
  }

export type WPWebsite = {
  settings?: WPWebsiteSetting
  database?: WPWebsiteDatabase
  domain?: Domain
  cmsType?: CMSType
   /**
    * The internal identifier of the entity
    */
  id?: number
   /**
    * The fully qualified class name of the object
    */
  objectType: typeof WPWebsiteObjectType[keyof typeof WPWebsiteObjectType] 
}
  
  