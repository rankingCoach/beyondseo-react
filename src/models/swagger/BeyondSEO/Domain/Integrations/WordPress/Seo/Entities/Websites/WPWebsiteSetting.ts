import {WPWebsiteDiscussionSetting} from '@models/swagger/BeyondSEO/Domain/Integrations/WordPress/Seo/Entities/Websites/Settings/WPWebsiteDiscussionSetting';
import {WPWebsiteGeneralSetting} from '@models/swagger/BeyondSEO/Domain/Integrations/WordPress/Seo/Entities/Websites/Settings/WPWebsiteGeneralSetting';
import {WPWebsiteReadingSetting} from '@models/swagger/BeyondSEO/Domain/Integrations/WordPress/Seo/Entities/Websites/Settings/WPWebsiteReadingSetting';

  export const WPWebsiteSettingObjectType = {
    BeyondSEO_Domain_Integrations_WordPress_Seo_Entities_Websites_WPWebsiteSetting : "BeyondSEO\\Domain\\Integrations\\WordPress\\Seo\\Entities\\Websites\\WPWebsiteSetting",
  }

export type WPWebsiteSetting = {
   /**
    * Site URL
    */
  siteUrl?: string
   /**
    * Home URL
    */
  homeUrl?: string
   /**
    * Blog name
    */
  blogName?: string
   /**
    * Blog description
    */
  blogDescription?: string
   /**
    * Admin email
    */
  adminEmail?: string
   /**
    * Site language
    */
  siteLanguage?: string
   /**
    * Is multisite
    */
  isMultisite?: boolean
   /**
    * Active plugins
    */
  activePlugins?: string
   /**
    * Template
    */
  template?: string
   /**
    * Stylesheet
    */
  stylesheet?: string
   /**
    * The unique key of the site
    */
  uniqueKey?: string
   /**
    * $rcUserId User ID on RC side
    */
  rcUserId?: number
   /**
    * $theme Theme name
    */
  theme?: string
   /**
    * $themeVersion Theme version
    */
  themeVersion?: string
   /**
    * $themeAuthor Theme author
    */
  themeAuthor?: string
   /**
    * $permalinkStructure Permalink structure
    */
  permalinkStructure?: string
   /**
    * <string,string> $allowedCountries List of allowed countries from plugin settings
    */
  allowedCountries?: any []
  discussion?: WPWebsiteDiscussionSetting
  general?: WPWebsiteGeneralSetting
  reading?: WPWebsiteReadingSetting
   /**
    * The fully qualified class name of the object
    */
  objectType: typeof WPWebsiteSettingObjectType[keyof typeof WPWebsiteSettingObjectType] 
}
  
  