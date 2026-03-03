import {Email} from '@models/swagger/BeyondSEO/Domain/Common/Entities/ContactInfos/Email';
import {PhoneNumber} from '@models/swagger/BeyondSEO/Domain/Common/Entities/ContactInfos/PhoneNumber';

  export const ContactInfosObjectType = {
    BeyondSEO_Domain_Common_Entities_ContactInfos_ContactInfos : "BeyondSEO\\Domain\\Common\\Entities\\ContactInfos\\ContactInfos",
  }

export type ContactInfos = {
  elements?: Array<Email | PhoneNumber>
   /**
    * The fully qualified class name of the object
    */
  objectType: typeof ContactInfosObjectType[keyof typeof ContactInfosObjectType] 
}
  
  