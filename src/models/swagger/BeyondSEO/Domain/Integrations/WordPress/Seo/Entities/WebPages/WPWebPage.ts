import {WPAccount} from '@models/swagger/BeyondSEO/Domain/Integrations/WordPress/Common/Entities/Accounts/WPAccount';
import {WebPageContent} from '@models/swagger/BeyondSEO/Domain/Seo/Entities/WebPages/WebPageContent';
import {WPWebPageContentMetaTags} from '@models/swagger/BeyondSEO/Domain/Integrations/WordPress/Seo/Entities/WebPages/Content/WPWebPageContentMetaTags';
import {WPWebPageSettings} from '@models/swagger/BeyondSEO/Domain/Integrations/WordPress/Seo/Entities/WebPages/Settings/WPWebPageSettings';
import {Domain} from '@models/swagger/BeyondSEO/Domain/Seo/Entities/Domains/Domain';
import {DomainValidation} from '@models/swagger/BeyondSEO/Domain/Seo/Entities/Domains/DomainValidation';

  export const WPWebPagePostType = {
    PAGE : "PAGE",
  POST : "POST",
  ATTACHMENT : "ATTACHMENT",
  REVISION : "REVISION",
  NAV_MENU_ITEM : "NAV_MENU_ITEM",
  WP_BLOCK : "WP_BLOCK",
  CUSTOM : "CUSTOM",
  }

  export const WPWebPageObjectType = {
    BeyondSEO_Domain_Integrations_WordPress_Seo_Entities_WebPages_WPWebPage : "BeyondSEO\\Domain\\Integrations\\WordPress\\Seo\\Entities\\WebPages\\WPWebPage",
  }

export type WPWebPage = {
   /**
    * Unique identifier for the content
    */
  id?: number
   /**
    * Author ID of the content
    */
  authorId?: number
  author?: WPAccount
   /**
    * Post type  
*  Allowed Values:  
* -   `PAGE`: CONTENT_TYPE_PAGE Represents a type page in WordPress
* -   `POST`: CONTENT_TYPE_POST Represents a blog post in WordPress
* -   `ATTACHMENT`: CONTENT_TYPE_ATTACHMENT Represents an attached media file (image, video, document)
* -   `REVISION`: CONTENT_TYPE_REVISION Represents a revision of a page or post
* -   `NAV_MENU_ITEM`: CONTENT_TYPE_NAVIGATION_MENU_ITEM Represents a navigation menu item
* -   `WP_BLOCK`: CONTENT_TYPE_WP_BLOCK Represents a reusable block in the Gutenberg editor
* -   `CUSTOM`: CONTENT_TYPE_CUSTOM Represents a custom post type
* 
    */
  postType: typeof WPWebPagePostType[keyof typeof WPWebPagePostType]
   /**
    * Date when the content was created
    */
  dateCreated?: string
   /**
    * Date in GMT when the content was created
    */
  dateCreatedGmt?: string
  content?: WebPageContent
  metaTags?: WPWebPageContentMetaTags
   /**
    * The content of the web page
    */
  webPageContent?: string
   /**
    * Excerpt or summary of the content
    */
  excerpt?: string
   /**
    * Current status of the content
    */
  status?: string
   /**
    * Comment status
    */
  commentStatus?: string
   /**
    * Ping status
    */
  pingStatus?: string
   /**
    * Content password
    */
  password?: string
   /**
    * URL-friendly version of the content title
    */
  slug?: string
   /**
    * List of URLs to ping
    */
  toPing?: string
   /**
    * List of pinged URLs
    */
  pinged?: string
   /**
    * Date when the content was last modified
    */
  dateModified?: string
   /**
    * Date in GMT when the content was last modified
    */
  dateModifiedGmt?: string
   /**
    * Filtered content
    */
  contentFiltered?: string
   /**
    * Parent content ID
    */
  parentId?: number
   /**
    * GUID
    */
  guid?: string
   /**
    * Menu order
    */
  menuOrder?: number
   /**
    * MIME type of the post
    */
  mimeType?: string
   /**
    * Comment count
    */
  commentCount?: number
   /**
    * The unique key of the content
    */
  uniqueKey?: string
  postMeta?: WPWebPageSettings
  domain?: Domain
   /**
    * The full URL of the WebPage
    */
  url?: string
   /**
    * The relative path of the WebPage on its Domain
    */
  path?: string
   /**
    * Whether the domain requires https
    */
  needsHttps?: boolean
  valid?: DomainValidation
   /**
    * The fully qualified class name of the object
    */
  objectType: typeof WPWebPageObjectType[keyof typeof WPWebPageObjectType] 
}
  
  