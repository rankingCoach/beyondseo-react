import {OptimiserContext} from '@models/swagger/App/Domain/Integrations/WordPress/Seo/Entities/Optimiser/Base/OptimiserContext';

  export const OptimiserContextsObjectType = {
    App_Domain_Integrations_WordPress_Seo_Entities_Optimiser_Base_OptimiserContexts : "App\\Domain\\Integrations\\WordPress\\Seo\\Entities\\Optimiser\\Base\\OptimiserContexts",
  }

export type OptimiserContexts = {
  elements?: OptimiserContext []
   /**
    * The fully qualified class name of the object
    */
  objectType: typeof OptimiserContextsObjectType[keyof typeof OptimiserContextsObjectType] 
}
  
  