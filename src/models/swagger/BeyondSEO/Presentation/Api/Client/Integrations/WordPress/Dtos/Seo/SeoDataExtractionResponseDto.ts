

export type SeoDataExtractionResponseDto = {
   /**
    * $format The format of the extracted data (csv or json)
    */
  format: string
   /**
    * $csv The extracted SEO data as CSV string (only when format is csv)
    */
  csv?: string
   /**
    * $jsonData The extracted SEO data as array (only when format is json)
    */
  jsonData?: any [] 
}
  
  