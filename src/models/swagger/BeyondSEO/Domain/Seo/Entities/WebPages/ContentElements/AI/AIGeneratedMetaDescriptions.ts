import {MetaDescription} from '@models/swagger/BeyondSEO/Domain/Seo/Entities/WebPages/ContentElements/MetaDescription';

  export const AIGeneratedMetaDescriptionsObjectType = {
    BeyondSEO_Domain_Seo_Entities_WebPages_ContentElements_AI_AIGeneratedMetaDescriptions : "BeyondSEO\\Domain\\Seo\\Entities\\WebPages\\ContentElements\\AI\\AIGeneratedMetaDescriptions",
  }

export type AIGeneratedMetaDescriptions = {
  elements?: MetaDescription []
   /**
    * The fully qualified class name of the object
    */
  objectType: typeof AIGeneratedMetaDescriptionsObjectType[keyof typeof AIGeneratedMetaDescriptionsObjectType] 
}
  
  