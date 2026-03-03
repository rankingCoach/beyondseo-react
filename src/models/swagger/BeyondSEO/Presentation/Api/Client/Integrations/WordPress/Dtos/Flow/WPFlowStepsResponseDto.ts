import {WPFlowSteps} from '@models/swagger/BeyondSEO/Domain/Integrations/WordPress/Setup/Entities/Flows/Steps/WPFlowSteps';

export type WPFlowStepsResponseDto = {
  steps: WPFlowSteps
   /**
    * Indicates if the address requirement should be prefilled
    */
  prefillAddressRequirement?: boolean 
}
  
  