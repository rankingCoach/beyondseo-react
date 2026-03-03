import {ValidationErrors} from '@models/swagger/DDD/Infrastructure/Validation/ValidationErrors';
import {ExceptionDetails} from '@models/swagger/DDD/Infrastructure/Exceptions/ExceptionDetails';

export type BadRequestException = {
  validationErrors?: ValidationErrors
   /**
    * Error message
    */
  error?: string
  exceptionDetails?: ExceptionDetails 
}
  
  