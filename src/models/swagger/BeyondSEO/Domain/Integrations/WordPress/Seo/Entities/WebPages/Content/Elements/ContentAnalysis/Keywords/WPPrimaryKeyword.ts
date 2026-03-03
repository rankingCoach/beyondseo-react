

  export const WPPrimaryKeywordObjectType = {
    BeyondSEO_Domain_Integrations_WordPress_Seo_Entities_WebPages_Content_Elements_ContentAnalysis_Keywords_WPPrimaryKeyword : "BeyondSEO\\Domain\\Integrations\\WordPress\\Seo\\Entities\\WebPages\\Content\\Elements\\ContentAnalysis\\Keywords\\WPPrimaryKeyword",
  }

export type WPPrimaryKeyword = {
   /**
    * $relevance_score The relevance score
    */
  relevance_score?: string
   /**
    * $intent The intent
    */
  intent?: string
   /**
    * $density The density
    */
  density?: string
   /**
    * $name The name
    */
  name?: string
   /**
    * $alias The alias
    */
  alias?: string
   /**
    * $unique_key The unique key
    */
  hash?: string
   /**
    * The database ID of the keyword
    */
  id?: number
   /**
    * The RankingCoach ID of this keyword
    */
  externalId?: number
   /**
    * The fully qualified class name of the object
    */
  objectType: typeof WPPrimaryKeywordObjectType[keyof typeof WPPrimaryKeywordObjectType] 
}
  
  