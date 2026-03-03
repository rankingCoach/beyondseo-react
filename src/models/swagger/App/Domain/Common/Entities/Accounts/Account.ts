import {Person} from '@models/swagger/App/Domain/Common/Entities/Persons/Person';
import {Roles} from '@models/swagger/DDD/Domain/Common/Entities/Roles/Roles';
import {ContactInfos} from '@models/swagger/App/Domain/Common/Entities/ContactInfos/ContactInfos';

  export const AccountStatus = {
    new : "new",
  active : "active",
  inactive : "inactive",
  cancelled : "cancelled",
  locked : "locked",
  expired : "expired",
  gdpr_deleted : "gdpr_deleted",
  }

  export const AccountType = {
    standard : "standard",
  agency_viewer : "agency_viewer",
  reseller : "reseller",
  admin : "admin",
  editor : "editor",
  author : "author",
  contributor : "contributor",
  subscriber : "subscriber",
  }

  export const AccountObjectType = {
    App_Domain_Common_Entities_Accounts_Account : "App\\Domain\\Common\\Entities\\Accounts\\Account",
  }

export type Account = {
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
  status: typeof AccountStatus[keyof typeof AccountStatus]
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
  type: typeof AccountType[keyof typeof AccountType]
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
    * The internal identifier of the entity
    */
  id?: number
   /**
    * The fully qualified class name of the object
    */
  objectType: typeof AccountObjectType[keyof typeof AccountObjectType] 
}
  
  