

export type PluginUpdateCheckResponseDto = {
   /**
    * Current version of the plugin
    */
  current_version: string
   /**
    * Latest available version of the plugin
    */
  latest_version: string
   /**
    * Whether an update is available
    */
  is_update_available: string
   /**
    * URL to download the update
    */
  update_url: string
   /**
    * Response message regarding the update check
    */
  update_response: string 
}
  
  