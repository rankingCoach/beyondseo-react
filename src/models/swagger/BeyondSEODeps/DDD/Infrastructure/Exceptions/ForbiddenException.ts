import {ExceptionDetails} from '@models/swagger/BeyondSEODeps/DDD/Infrastructure/Exceptions/ExceptionDetails';

export type ForbiddenException = {
   /**
    * Error message
    */
  error?: string
  exceptionDetails?: ExceptionDetails 
}
  
  