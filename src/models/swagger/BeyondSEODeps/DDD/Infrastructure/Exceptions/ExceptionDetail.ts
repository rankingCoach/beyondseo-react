

  export const ExceptionDetailObjectType = {
    BeyondSEODeps_DDD_Infrastructure_Exceptions_ExceptionDetail : "BeyondSEODeps\\DDD\\Infrastructure\\Exceptions\\ExceptionDetail",
  }

export type ExceptionDetail = {
   /**
    * Exception message
    */
  message?: string
   /**
    * Exception detail, can be a payload of different types
    */
  details?: any []
   /**
    * The fully qualified class name of the object
    */
  objectType: typeof ExceptionDetailObjectType[keyof typeof ExceptionDetailObjectType] 
}
  
  