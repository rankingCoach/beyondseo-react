import {Heading} from '@models/swagger/App/Domain/Seo/Entities/WebPages/ContentElements/Heading';

  export const HeadingsObjectType = {
    App_Domain_Seo_Entities_WebPages_ContentElements_Headings : "App\\Domain\\Seo\\Entities\\WebPages\\ContentElements\\Headings",
  }

export type Headings = {
  elements?: Heading []
   /**
    * The fully qualified class name of the object
    */
  objectType: typeof HeadingsObjectType[keyof typeof HeadingsObjectType] 
}
  
  