

  export const PhoneNumberType = {
    PHONE : "PHONE",
  }

  export const PhoneNumberScope = {
    PHONE : "PHONE",
  MOBILEPHONE : "MOBILEPHONE",
  ADDITIONALPHONE : "ADDITIONALPHONE",
  FAX : "FAX",
  }

  export const PhoneNumberValidationLevel = {
    VALIDATION_EXACT : "VALIDATION_EXACT",
  VALIDATION_POSSIBLE : "VALIDATION_POSSIBLE",
  }

  export const PhoneNumberObjectType = {
    App_Domain_Common_Entities_ContactInfos_PhoneNumber : "App\\Domain\\Common\\Entities\\ContactInfos\\PhoneNumber",
  }

export type PhoneNumber = {
   /**
    * Type of ContactInfo  
*  Allowed Values:  
* -   `PHONE`: Contact info type Phone
* 
    */
  type: typeof PhoneNumberType[keyof typeof PhoneNumberType]
   /**
    *   
*  Allowed Values:  
* -   `PHONE`: Contact info type Phone
* -   `MOBILEPHONE`: The scope Mobile Phone of the PhoneNumber
* -   `ADDITIONALPHONE`: The scope Additional Phone of the PhoneNumber
* -   `FAX`: The scope Fax of the PhoneNumber
* 
    */
  scope: typeof PhoneNumberScope[keyof typeof PhoneNumberScope]
   /**
    * The phone number itself
    */
  value?: string
   /**
    * The countryShortCode of the Numbers country
    */
  countryShortCode?: string
   /**
    * Validation level of the PhoneNumber  
*  Allowed Values:  
* -   `VALIDATION_EXACT`: Validates if number is valid
* -   `VALIDATION_POSSIBLE`: Validates if number is a possible number, this is a lay validation
* 
    */
  validationLevel: typeof PhoneNumberValidationLevel[keyof typeof PhoneNumberValidationLevel]
   /**
    * The fully qualified class name of the object
    */
  objectType: typeof PhoneNumberObjectType[keyof typeof PhoneNumberObjectType] 
}
  
  