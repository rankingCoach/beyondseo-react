

export type UpdateRedirectRequestDto = {
   /**
    * Unique identifier for the redirect
    */
  id: string
   /**
    * Source URI to redirect from
    */
  source_uri?: string
   /**
    * Destination URL to redirect to
    */
  destination_url?: string
   /**
    * HTTP redirect code (301 or 302)
    */
  redirect_code?: string
   /**
    * Whether the redirect is active (0 or 1)
    */
  active?: string 
}
  
  