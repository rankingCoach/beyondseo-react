

  export const MainContentObjectType = {
    App_Domain_Seo_Entities_WebPages_ContentElements_MainContent : "App\\Domain\\Seo\\Entities\\WebPages\\ContentElements\\MainContent",
  }

export type MainContent = {
   /**
    * The content of the element
    */
  content?: string
   /**
    * The fully qualified class name of the object
    */
  objectType: typeof MainContentObjectType[keyof typeof MainContentObjectType] 
}
  
  