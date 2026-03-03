import {ValidationResult} from '@models/swagger/BeyondSEODeps/DDD/Infrastructure/Validation/ValidationResult';

  export const ValidationErrorObjectType = {
    BeyondSEODeps_DDD_Infrastructure_Validation_ValidationError : "BeyondSEODeps\\DDD\\Infrastructure\\Validation\\ValidationError",
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
  
  