

  export const HeadingHeadingType = {
    H1 : "H1",
  H2 : "H2",
  H3 : "H3",
  H4 : "H4",
  H5 : "H5",
  H6 : "H6",
  }

  export const HeadingObjectType = {
    App_Domain_Seo_Entities_WebPages_ContentElements_Heading : "App\\Domain\\Seo\\Entities\\WebPages\\ContentElements\\Heading",
  }

export type Heading = {
   /**
    * Position in content for sorting
    */
  positionInDom?: number
   /**
    * The type of the Heading  
*  Allowed Values:  
* -   `H1`: H1 heading
* -   `H2`: H1 heading
* -   `H3`: H1 heading
* -   `H4`: H1 heading
* -   `H5`: H1 heading
* -   `H6`: H1 heading
* 
    */
  headingType: typeof HeadingHeadingType[keyof typeof HeadingHeadingType]
   /**
    * The content of the element
    */
  content?: string
   /**
    * The fully qualified class name of the object
    */
  objectType: typeof HeadingObjectType[keyof typeof HeadingObjectType] 
}
  
  