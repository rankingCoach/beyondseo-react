

  export const KeywordObjectType = {
    BeyondSEO_Domain_Common_Entities_Keywords_Keyword : "BeyondSEO\\Domain\\Common\\Entities\\Keywords\\Keyword",
  }

export type Keyword = {
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
    * The internal identifier of the entity
    */
  id?: number
   /**
    * The fully qualified class name of the object
    */
  objectType: typeof KeywordObjectType[keyof typeof KeywordObjectType] 
}
  
  