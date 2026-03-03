import {Factor} from '@models/swagger/BeyondSEO/Domain/Integrations/WordPress/Seo/Entities/Optimiser/Base/Factor';

  export const FactorsObjectType = {
    BeyondSEO_Domain_Integrations_WordPress_Seo_Entities_Optimiser_Base_Factors : "BeyondSEO\\Domain\\Integrations\\WordPress\\Seo\\Entities\\Optimiser\\Base\\Factors",
  }

export type Factors = {
  elements?: Factor []
   /**
    * The fully qualified class name of the object
    */
  objectType: typeof FactorsObjectType[keyof typeof FactorsObjectType] 
}
  
  