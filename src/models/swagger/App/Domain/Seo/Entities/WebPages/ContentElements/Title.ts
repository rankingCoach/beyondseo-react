import {AIGeneratedTitles} from '@models/swagger/App/Domain/Seo/Entities/WebPages/ContentElements/AI/AIGeneratedTitles';

  export const TitleObjectType = {
    App_Domain_Seo_Entities_WebPages_ContentElements_Title : "App\\Domain\\Seo\\Entities\\WebPages\\ContentElements\\Title",
  }

export type Title = {
  aiGeneratedVersions?: AIGeneratedTitles
   /**
    * The content of the element
    */
  content?: string
   /**
    * The fully qualified class name of the object
    */
  objectType: typeof TitleObjectType[keyof typeof TitleObjectType] 
}
  
  