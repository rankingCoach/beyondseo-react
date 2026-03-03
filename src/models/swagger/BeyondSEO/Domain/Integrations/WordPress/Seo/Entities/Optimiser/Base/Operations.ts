import {Operation} from '@models/swagger/BeyondSEO/Domain/Integrations/WordPress/Seo/Entities/Optimiser/Base/Operation';

  export const OperationsObjectType = {
    BeyondSEO_Domain_Integrations_WordPress_Seo_Entities_Optimiser_Base_Operations : "BeyondSEO\\Domain\\Integrations\\WordPress\\Seo\\Entities\\Optimiser\\Base\\Operations",
  }

export type Operations = {
  elements?: Operation []
   /**
    * The fully qualified class name of the object
    */
  objectType: typeof OperationsObjectType[keyof typeof OperationsObjectType] 
}
  
  