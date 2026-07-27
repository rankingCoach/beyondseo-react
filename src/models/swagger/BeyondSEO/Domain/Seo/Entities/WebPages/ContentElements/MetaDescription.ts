import {AIGeneratedMetaDescriptions} from '@models/swagger/BeyondSEO/Domain/Seo/Entities/WebPages/ContentElements/AI/AIGeneratedMetaDescriptions';

  export const MetaDescriptionObjectType = {
    BeyondSEO_Domain_Seo_Entities_WebPages_ContentElements_MetaDescription : "BeyondSEO\\Domain\\Seo\\Entities\\WebPages\\ContentElements\\MetaDescription",
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
  
  