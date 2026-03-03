import {PersonGender} from '@models/swagger/BeyondSEO/Domain/Common/Entities/Persons/PersonGender';

  export const PersonObjectType = {
    BeyondSEO_Domain_Common_Entities_Persons_Person : "BeyondSEO\\Domain\\Common\\Entities\\Persons\\Person",
  }

export type Person = {
   /**
    * The last name of the person
    */
  lastName?: string
   /**
    * The first name of the person
    */
  firstName?: string
   /**
    * Title that is used in the salutation
    */
  title?: string
   /**
    * The academic title of the person
    */
  academicTitle?: string
   /**
    * The job title of the person
    */
  jobTitle?: string
  gender?: PersonGender
   /**
    * The fully qualified class name of the object
    */
  objectType: typeof PersonObjectType[keyof typeof PersonObjectType] 
}
  
  