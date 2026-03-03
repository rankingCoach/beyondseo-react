import {Heading} from '@models/swagger/BeyondSEO/Domain/Seo/Entities/WebPages/ContentElements/Heading';

  export const HeadingsObjectType = {
    BeyondSEO_Domain_Seo_Entities_WebPages_ContentElements_Headings : "BeyondSEO\\Domain\\Seo\\Entities\\WebPages\\ContentElements\\Headings",
  }

export type Headings = {
  elements?: Heading []
   /**
    * The fully qualified class name of the object
    */
  objectType: typeof HeadingsObjectType[keyof typeof HeadingsObjectType] 
}
  
  