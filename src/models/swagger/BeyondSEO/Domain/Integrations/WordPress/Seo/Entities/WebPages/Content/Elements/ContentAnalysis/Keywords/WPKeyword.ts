

  export const WPKeywordObjectType = {
    BeyondSEO_Domain_Integrations_WordPress_Seo_Entities_WebPages_Content_Elements_ContentAnalysis_Keywords_WPKeyword : "BeyondSEO\\Domain\\Integrations\\WordPress\\Seo\\Entities\\WebPages\\Content\\Elements\\ContentAnalysis\\Keywords\\WPKeyword",
  }

export type WPKeyword = {
   /**
    * The database ID of the keyword
    */
  id?: number
   /**
    * The RankingCoach ID of this keyword
    */
  externalId?: number
   /**
    * The alias for the keyword
    */
  alias?: string
   /**
    * The hashed value of the keyword name
    */
  hash?: string
   /**
    * The keyword name
    */
  name?: string
   /**
    * The fully qualified class name of the object
    */
  objectType: typeof WPKeywordObjectType[keyof typeof WPKeywordObjectType] 
}
  
  