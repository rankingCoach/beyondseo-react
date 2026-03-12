

  export const MetaDescriptionObjectType = {
    BeyondSEO_Domain_Seo_Entities_WebPages_ContentElements_MetaDescription : "BeyondSEO\\Domain\\Seo\\Entities\\WebPages\\ContentElements\\MetaDescription",
  }

export type MetaDescription = {
   /**
    * The content of the element
    */
  content?: string
   /**
    * The fully qualified class name of the object
    */
  objectType: typeof MetaDescriptionObjectType[keyof typeof MetaDescriptionObjectType] 
}
  
  