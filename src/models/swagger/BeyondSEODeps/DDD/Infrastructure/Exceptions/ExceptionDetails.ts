import {ExceptionDetail} from '@models/swagger/BeyondSEODeps/DDD/Infrastructure/Exceptions/ExceptionDetail';

  export const ExceptionDetailsObjectType = {
    BeyondSEODeps_DDD_Infrastructure_Exceptions_ExceptionDetails : "BeyondSEODeps\\DDD\\Infrastructure\\Exceptions\\ExceptionDetails",
  }

export type ExceptionDetails = {
  elements?: ExceptionDetail []
   /**
    * The fully qualified class name of the object
    */
  objectType: typeof ExceptionDetailsObjectType[keyof typeof ExceptionDetailsObjectType] 
}
  
  