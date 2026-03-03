

export type GetAllLinksResponseDto = {
   /**
    * $limit Maximum number of results returned
    */
  limit: string
   /**
    * $offset Offset for pagination
    */
  offset: string
   /**
    * $count Total count of links
    */
  count: string
   /**
    * $data Array of link data
    */
  data: any [] 
}
  
  