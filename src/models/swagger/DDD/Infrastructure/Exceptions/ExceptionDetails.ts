import {ExceptionDetail} from '@models/swagger/DDD/Infrastructure/Exceptions/ExceptionDetail';

  export const ExceptionDetailsObjectType = {
    DDD_Infrastructure_Exceptions_ExceptionDetails : "DDD\\Infrastructure\\Exceptions\\ExceptionDetails",
  }

export type ExceptionDetails = {
  elements?: ExceptionDetail []
   /**
    * The fully qualified class name of the object
    */
  objectType: typeof ExceptionDetailsObjectType[keyof typeof ExceptionDetailsObjectType] 
}
  
  