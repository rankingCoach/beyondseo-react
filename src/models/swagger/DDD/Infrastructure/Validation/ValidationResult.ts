

  export const ValidationResultObjectType = {
    DDD_Infrastructure_Validation_ValidationResult : "DDD\\Infrastructure\\Validation\\ValidationResult",
  }

export type ValidationResult = {
   /**
    * The name of the property where the validation failed
    */
  propertyName?: string
   /**
    * The error message for the validation
    */
  errorMessage?: string
   /**
    * The value that was given and which failed the validation
    */
  receivedValue?: string
   /**
    * Complete path to the type of the property for which the validation failed
    */
  className?: string
   /**
    * The fully qualified class name of the object
    */
  objectType: typeof ValidationResultObjectType[keyof typeof ValidationResultObjectType] 
}
  
  