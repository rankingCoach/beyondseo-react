

export type BreadcrumbsRequestDto = {
   /**
    * Array of breadcrumb types to generate
    */
  types: string []
   /**
    * Context information for breadcrumb generation
    */
  context: any []
   /**
    * Post ID for context (if applicable)
    */
  post_id: string 
}
  
  