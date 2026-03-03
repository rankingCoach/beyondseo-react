import {Title} from '@models/swagger/BeyondSEO/Domain/Seo/Entities/WebPages/ContentElements/Title';

  export const AIGeneratedTitlesObjectType = {
    BeyondSEO_Domain_Seo_Entities_WebPages_ContentElements_AI_AIGeneratedTitles : "BeyondSEO\\Domain\\Seo\\Entities\\WebPages\\ContentElements\\AI\\AIGeneratedTitles",
  }

export type AIGeneratedTitles = {
  elements?: Title []
   /**
    * The fully qualified class name of the object
    */
  objectType: typeof AIGeneratedTitlesObjectType[keyof typeof AIGeneratedTitlesObjectType] 
}
  
  