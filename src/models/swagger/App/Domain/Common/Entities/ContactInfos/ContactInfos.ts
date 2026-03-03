import {Email} from '@models/swagger/App/Domain/Common/Entities/ContactInfos/Email';
import {PhoneNumber} from '@models/swagger/App/Domain/Common/Entities/ContactInfos/PhoneNumber';

  export const ContactInfosObjectType = {
    App_Domain_Common_Entities_ContactInfos_ContactInfos : "App\\Domain\\Common\\Entities\\ContactInfos\\ContactInfos",
  }

export type ContactInfos = {
  elements?: Array<Email | PhoneNumber>
   /**
    * The fully qualified class name of the object
    */
  objectType: typeof ContactInfosObjectType[keyof typeof ContactInfosObjectType] 
}
  
  