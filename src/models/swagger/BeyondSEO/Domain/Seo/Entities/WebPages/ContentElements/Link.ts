

  export const LinkObjectType = {
    BeyondSEO_Domain_Seo_Entities_WebPages_ContentElements_Link : "BeyondSEO\\Domain\\Seo\\Entities\\WebPages\\ContentElements\\Link",
  }

export type Link = {
   /**
    * The href property of the Link
    */
  href?: string
   /**
    * The content of the element
    */
  content?: string
   /**
    * The fully qualified class name of the object
    */
  objectType: typeof LinkObjectType[keyof typeof LinkObjectType] 
}
  
  