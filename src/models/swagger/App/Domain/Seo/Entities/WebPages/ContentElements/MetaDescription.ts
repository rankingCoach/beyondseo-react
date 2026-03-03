import {AIGeneratedMetaDescriptions} from '@models/swagger/App/Domain/Seo/Entities/WebPages/ContentElements/AI/AIGeneratedMetaDescriptions';

  export const MetaDescriptionObjectType = {
    App_Domain_Seo_Entities_WebPages_ContentElements_MetaDescription : "App\\Domain\\Seo\\Entities\\WebPages\\ContentElements\\MetaDescription",
  }

export type MetaDescription = {
  aiGeneratedVersions?: AIGeneratedMetaDescriptions
   /**
    * The content of the element
    */
  content?: string
   /**
    * The fully qualified class name of the object
    */
  objectType: typeof MetaDescriptionObjectType[keyof typeof MetaDescriptionObjectType] 
}
  
  