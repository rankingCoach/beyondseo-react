import {ValidationError} from '@models/swagger/DDD/Infrastructure/Validation/ValidationError';

  export const ValidationErrorsObjectType = {
    DDD_Infrastructure_Validation_ValidationErrors : "DDD\\Infrastructure\\Validation\\ValidationErrors",
  }

export type ValidationErrors = {
  elements?: ValidationError []
   /**
    * The fully qualified class name of the object
    */
  objectType: typeof ValidationErrorsObjectType[keyof typeof ValidationErrorsObjectType] 
}
  
  