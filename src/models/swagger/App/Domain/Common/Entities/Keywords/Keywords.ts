import {Keyword} from '@models/swagger/App/Domain/Common/Entities/Keywords/Keyword';

  export const KeywordsObjectType = {
    App_Domain_Common_Entities_Keywords_Keywords : "App\\Domain\\Common\\Entities\\Keywords\\Keywords",
  }

export type Keywords = {
  elements?: Keyword []
   /**
    * The fully qualified class name of the object
    */
  objectType: typeof KeywordsObjectType[keyof typeof KeywordsObjectType] 
}
  
  