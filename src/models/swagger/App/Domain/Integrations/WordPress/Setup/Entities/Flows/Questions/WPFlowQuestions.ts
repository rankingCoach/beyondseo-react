import {WPFlowQuestion} from '@models/swagger/App/Domain/Integrations/WordPress/Setup/Entities/Flows/Questions/WPFlowQuestion';

  export const WPFlowQuestionsObjectType = {
    App_Domain_Integrations_WordPress_Setup_Entities_Flows_Questions_WPFlowQuestions : "App\\Domain\\Integrations\\WordPress\\Setup\\Entities\\Flows\\Questions\\WPFlowQuestions",
  }

export type WPFlowQuestions = {
  elements?: WPFlowQuestion []
   /**
    * The fully qualified class name of the object
    */
  objectType: typeof WPFlowQuestionsObjectType[keyof typeof WPFlowQuestionsObjectType] 
}
  
  