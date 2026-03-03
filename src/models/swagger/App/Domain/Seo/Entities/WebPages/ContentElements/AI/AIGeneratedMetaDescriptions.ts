import {MetaDescription} from '@models/swagger/App/Domain/Seo/Entities/WebPages/ContentElements/MetaDescription';

  export const AIGeneratedMetaDescriptionsObjectType = {
    App_Domain_Seo_Entities_WebPages_ContentElements_AI_AIGeneratedMetaDescriptions : "App\\Domain\\Seo\\Entities\\WebPages\\ContentElements\\AI\\AIGeneratedMetaDescriptions",
  }

export type AIGeneratedMetaDescriptions = {
  elements?: MetaDescription []
   /**
    * The fully qualified class name of the object
    */
  objectType: typeof AIGeneratedMetaDescriptionsObjectType[keyof typeof AIGeneratedMetaDescriptionsObjectType] 
}
  
  