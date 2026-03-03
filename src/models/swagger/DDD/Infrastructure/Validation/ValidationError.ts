import {ValidationResult} from '@models/swagger/DDD/Infrastructure/Validation/ValidationResult';

  export const ValidationErrorObjectType = {
    DDD_Infrastructure_Validation_ValidationError : "DDD\\Infrastructure\\Validation\\ValidationError",
  }

export type ValidationError = {
   /**
    * Complete object path to the property where validation failed
    */
  jsonPath?: string
  elements?: ValidationResult []
   /**
    * The fully qualified class name of the object
    */
  objectType: typeof ValidationErrorObjectType[keyof typeof ValidationErrorObjectType] 
}
  
  