import {OptimiserContext} from '@models/swagger/BeyondSEO/Domain/Integrations/WordPress/Seo/Entities/Optimiser/Base/OptimiserContext';

  export const OptimiserContextsObjectType = {
    BeyondSEO_Domain_Integrations_WordPress_Seo_Entities_Optimiser_Base_OptimiserContexts : "BeyondSEO\\Domain\\Integrations\\WordPress\\Seo\\Entities\\Optimiser\\Base\\OptimiserContexts",
  }

export type OptimiserContexts = {
  elements?: OptimiserContext []
   /**
    * The fully qualified class name of the object
    */
  objectType: typeof OptimiserContextsObjectType[keyof typeof OptimiserContextsObjectType] 
}
  
  