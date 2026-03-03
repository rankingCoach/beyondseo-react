import {Roles} from '@models/swagger/App/Domain/Common/Entities/Roles/Roles';
import {Capabilities} from '@models/swagger/App/Domain/Common/Entities/Capabilities/Capabilities';
import {WPLegacyAccountSettings} from '@models/swagger/App/Domain/Integrations/WordPress/Common/Entities/Accounts/Legacy/Settings/WPLegacyAccountSettings';
import {Person} from '@models/swagger/App/Domain/Common/Entities/Persons/Person';
import {Account} from '@models/swagger/App/Domain/Common/Entities/Accounts/Account';
import {Roles} from '@models/swagger/DDD/Domain/Common/Entities/Roles/Roles';
import {ContactInfos} from '@models/swagger/App/Domain/Common/Entities/ContactInfos/ContactInfos';

  export const WPLegacyAccountStatus = {
    new : "new",
  active : "active",
  inactive : "inactive",
  cancelled : "cancelled",
  locked : "locked",
  expired : "expired",
  gdpr_deleted : "gdpr_deleted",
  }

  export const WPLegacyAccountType = {
    standard : "standard",
  agency_viewer : "agency_viewer",
  reseller : "reseller",
  admin : "admin",
  editor : "editor",
  author : "author",
  contributor : "contributor",
  subscriber : "subscriber",
  }

  export const WPLegacyAccountObjectType = {
    App_Domain_Integrations_WordPress_Common_Entities_Accounts_Legacy_WPLegacyAccount : "App\\Domain\\Integrations\\WordPress\\Common\\Entities\\Accounts\\Legacy\\WPLegacyAccount",
  }

export type WPLegacyAccount = {
   /**
    * $id The ID of the user.
    */
  id?: number
   /**
    * $displayName The display name of the user.
    */
  displayName?: string
   /**
    * $userLogin The login name of the user.
    */
  userLogin?: string
   /**
    * $userNicename The nice name of the user.
    */
  userNicename?: string
   /**
    * $userEmail The email address of the user.
    */
  userEmail?: string
   /**
    * $userUrl The URL of the user.
    */
  userUrl?: string
   /**
    * $userRegistered The date the user registered on the site.
    */
  userRegistered?: string
   /**
    * $userActivationKey The activation key for the user.
    */
  userActivationKey?: string
   /**
    * $userStatus The status of the user.
    */
  userStatus?: number
  userRoles?: Roles
  userCapabilities?: Capabilities
  accountSettings?: WPLegacyAccountSettings
   /**
    * The unique key of the content
    */
  uniqueKey?: string
   /**
    * Account's status  
*  Allowed Values:  
* -   `new`
* -   `active`
* -   `inactive`
* -   `cancelled`
* -   `locked`
* -   `expired`
* -   `gdpr_deleted`
* 
    */
  status: typeof WPLegacyAccountStatus[keyof typeof WPLegacyAccountStatus]
  owner?: Person
   /**
    * Account's invoice country
    */
  invoiceCountryId?: number
   /**
    * Account's parentAccountId, if set, this is a subAccount
    */
  parentAccountId?: number
   /**
    * Whether account is using sandbox or not
    */
  isSandboxAccount?: boolean
   /**
    * Whether account is special or not
    */
  isSpecialAccount?: boolean
  parentAccount?: Account
   /**
    * Account's partner externalId
    */
  externalId?: string
   /**
    * Account's type  
*  Allowed Values:  
* -   `standard`: Standard account
* -   `agency_viewer`: Agency account that can only view reports without rights to operate or change the location
* -   `reseller`: Resellers main account that connection to api account and can manage all his reseller accounts
* -   `admin`: ACCOUNT_TYPE_ADMIN Represents a type of user that has full access to the WordPress site.
* -   `editor`: ACCOUNT_TYPE_EDITOR Represents a type of user that can publish and manage posts and pages.
* -   `author`: ACCOUNT_TYPE_AUTHOR Represents a type of user that can publish and manage their own posts.
* -   `contributor`: ACCOUNT_TYPE_CONTRIBUTOR Represents a type of user that can write and manage their own posts but cannot publish them.
* -   `subscriber`: ACCOUNT_TYPE_SUBSCRIBER Represents a type of user that can only manage their profile.
* 
    */
  type: typeof WPLegacyAccountType[keyof typeof WPLegacyAccountType]
  roles?: Roles
  contactInfos?: ContactInfos
   /**
    * Account's language code
    */
  languageCode?: string
   /**
    * Number of active Projects
    */
  totalNumberOfActiveProjects?: number
   /**
    * Account's email
    */
  email?: string
   /**
    * The fully qualified class name of the object
    */
  objectType: typeof WPLegacyAccountObjectType[keyof typeof WPLegacyAccountObjectType] 
}
  
  