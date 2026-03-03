import {ValidationError} from '@models/swagger/BeyondSEODeps/DDD/Infrastructure/Validation/ValidationError';

  export const ValidationErrorsObjectType = {
    BeyondSEODeps_DDD_Infrastructure_Validation_ValidationErrors : "BeyondSEODeps\\DDD\\Infrastructure\\Validation\\ValidationErrors",
  }

export type ValidationErrors = {
  elements?: ValidationError []
   /**
    * The fully qualified class name of the object
    */
  objectType: typeof ValidationErrorsObjectType[keyof typeof ValidationErrorsObjectType] 
}
  
  