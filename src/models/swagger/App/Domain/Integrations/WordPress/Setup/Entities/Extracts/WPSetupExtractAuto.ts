

  export const WPSetupExtractAutoObjectType = {
    App_Domain_Integrations_WordPress_Setup_Entities_Extracts_WPSetupExtractAuto : "App\\Domain\\Integrations\\WordPress\\Setup\\Entities\\Extracts\\WPSetupExtractAuto",
  }

export type WPSetupExtractAuto = {
  content?: string
  countryCode?: string
  requirements?: object
  accuracyScore?: number
   /**
    * The fully qualified class name of the object
    */
  objectType: typeof WPSetupExtractAutoObjectType[keyof typeof WPSetupExtractAutoObjectType] 
}
  
  