

export type ServiceSyncResponseDto = {
   /**
    * Set of synced keywords with verified externalIds
    */
  keywords?: object
   /**
    * $success Whether the sync was successful
    */
  success?: boolean
   /**
    * $message Error message if sync failed
    */
  message?: string 
}
  
  