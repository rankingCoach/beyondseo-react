import {WPCategory} from '@models/swagger/App/Domain/Integrations/WordPress/Common/Entities/Categories/WPCategory';

  export const WPCategoriesObjectType = {
    App_Domain_Integrations_WordPress_Common_Entities_Categories_WPCategories : "App\\Domain\\Integrations\\WordPress\\Common\\Entities\\Categories\\WPCategories",
  }

export type WPCategories = {
  elements?: WPCategory []
   /**
    * The fully qualified class name of the object
    */
  objectType: typeof WPCategoriesObjectType[keyof typeof WPCategoriesObjectType] 
}
  
  