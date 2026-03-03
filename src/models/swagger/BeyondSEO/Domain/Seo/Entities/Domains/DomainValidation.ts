

  export const DomainValidationValidationMode = {
    full : "full",
  host : "host",
  }

  export const DomainValidationObjectType = {
    BeyondSEO_Domain_Seo_Entities_Domains_DomainValidation : "BeyondSEO\\Domain\\Seo\\Entities\\Domains\\DomainValidation",
  }

export type DomainValidation = {
   /**
    * Whether the domain is valid or not
    */
  isValid?: boolean
  validateWithoutProtocol?: boolean
   /**
    * Whether the domain requires www subdomain to load or not
    */
  needsWww?: boolean
   /**
    * Whether the domain is working only explicitly without www or not
    */
  needsNoWww?: boolean
   /**
    * Whether the domain requires https connection or not
    */
  needsHttps?: boolean
   /**
    * the http code of the response
    */
  httpCode?: number
   /**
    * Content length in bytes of the response
    */
  contentLength?: number
   /**
    * The amount of words in the content
    */
  wordsCount?: number
   /**
    * The amount of redirects performed until the final page is reached
    */
  redirectCount?: number
   /**
    * The amount of retries
    */
  retryCount?: number
   /**
    * The initial URL of the request
    */
  initialUrl?: string
   /**
    * The url finally redirected to
    */
  redirectUrl?: string
   /**
    * The url retried
    */
  retryUrl?: string
   /**
    * The url filtered
    */
  filteredUrl?: string
   /**
    * Default timeout to wait until giving up
    */
  timeout?: number
   /**
    * Country shortcode for IPs to be used for validation
    */
  countryShortCode?: string
   /**
    * The type of validation performed, full means that the content is loaded and status code is analyzed, host means, that only the validity of the host is verified  
*  Allowed Values:  
* -   `full`
* -   `host`
* 
    */
  validationMode: typeof DomainValidationValidationMode[keyof typeof DomainValidationValidationMode]
   /**
    * The fully qualified class name of the object
    */
  objectType: typeof DomainValidationObjectType[keyof typeof DomainValidationObjectType] 
}
  
  