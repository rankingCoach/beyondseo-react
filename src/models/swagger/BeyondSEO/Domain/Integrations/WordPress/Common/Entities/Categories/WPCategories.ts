import {WPCategory} from '@models/swagger/BeyondSEO/Domain/Integrations/WordPress/Common/Entities/Categories/WPCategory';

  export const WPCategoriesObjectType = {
    BeyondSEO_Domain_Integrations_WordPress_Common_Entities_Categories_WPCategories : "BeyondSEO\\Domain\\Integrations\\WordPress\\Common\\Entities\\Categories\\WPCategories",
  }

export type WPCategories = {
  elements?: WPCategory []
   /**
    * The fully qualified class name of the object
    */
  objectType: typeof WPCategoriesObjectType[keyof typeof WPCategoriesObjectType] 
}
  
  