import {ExceptionDetails} from '@models/swagger/DDD/Infrastructure/Exceptions/ExceptionDetails';

export type InternalErrorException = {
   /**
    * Error message
    */
  error?: string
  exceptionDetails?: ExceptionDetails 
}
  
  