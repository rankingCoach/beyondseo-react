import {DomainValidation} from '@models/swagger/BeyondSEO/Domain/Seo/Entities/Domains/DomainValidation';
import {DomainContent} from '@models/swagger/BeyondSEO/Domain/Seo/Entities/Domains/DomainContent';
import {WebPages} from '@models/swagger/BeyondSEO/Domain/Seo/Entities/WebPages/WebPages';

  export const DomainObjectType = {
    BeyondSEO_Domain_Seo_Entities_Domains_Domain : "BeyondSEO\\Domain\\Seo\\Entities\\Domains\\Domain",
  }

export type Domain = {
   /**
    * The name of the domain
    */
  name?: string
   /**
    * The path of the domain
    */
  path?: string
   /**
    * Whether the domain requires www
    */
  needsWww?: boolean
   /**
    * Whether the domain requires https
    */
  needsHttps?: boolean
   /**
    * Whether to exclude path in page URL, e.g. in Landingpages we don't need the path too because that's contained in page url.
    */
  excludePathInPageUrl?: boolean
  valid?: DomainValidation
  content?: DomainContent
  webPages?: WebPages
   /**
    * The internal identifier of the entity
    */
  id?: number
   /**
    * The fully qualified class name of the object
    */
  objectType: typeof DomainObjectType[keyof typeof DomainObjectType] 
}
  
  