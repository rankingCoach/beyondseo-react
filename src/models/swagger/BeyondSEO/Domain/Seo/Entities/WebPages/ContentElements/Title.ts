

  export const TitleObjectType = {
    BeyondSEO_Domain_Seo_Entities_WebPages_ContentElements_Title : "BeyondSEO\\Domain\\Seo\\Entities\\WebPages\\ContentElements\\Title",
  }

export type Title = {
   /**
    * The content of the element
    */
  content?: string
   /**
    * The fully qualified class name of the object
    */
  objectType: typeof TitleObjectType[keyof typeof TitleObjectType] 
}
  
  