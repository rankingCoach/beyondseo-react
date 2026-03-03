import {Link} from '@models/swagger/BeyondSEO/Domain/Seo/Entities/WebPages/ContentElements/Link';

  export const LinksObjectType = {
    BeyondSEO_Domain_Seo_Entities_WebPages_ContentElements_Links : "BeyondSEO\\Domain\\Seo\\Entities\\WebPages\\ContentElements\\Links",
  }

export type Links = {
  elements?: Link []
   /**
    * The fully qualified class name of the object
    */
  objectType: typeof LinksObjectType[keyof typeof LinksObjectType] 
}
  
  