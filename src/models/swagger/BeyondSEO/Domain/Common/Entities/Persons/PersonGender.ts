

  export const PersonGenderGender = {
    m : "m",
  f : "f",
  d : "d",
  a : "a",
  }

  export const PersonGenderObjectType = {
    BeyondSEO_Domain_Common_Entities_Persons_PersonGender : "BeyondSEO\\Domain\\Common\\Entities\\Persons\\PersonGender",
  }

export type PersonGender = {
   /**
    * The persons gender  
*  Allowed Values:  
* -   `m`: Male gender
* -   `f`: Female gender
* -   `d`: Other gender
* -   `a`: All gender
* 
    */
  gender: typeof PersonGenderGender[keyof typeof PersonGenderGender]
   /**
    * The fully qualified class name of the object
    */
  objectType: typeof PersonGenderObjectType[keyof typeof PersonGenderObjectType] 
}
  
  