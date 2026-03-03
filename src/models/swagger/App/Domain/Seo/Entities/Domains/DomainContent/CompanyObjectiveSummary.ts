

  export const CompanyObjectiveSummaryObjectType = {
    App_Domain_Seo_Entities_Domains_DomainContent_CompanyObjectiveSummary : "App\\Domain\\Seo\\Entities\\Domains\\DomainContent\\CompanyObjectiveSummary",
  }

export type CompanyObjectiveSummary = {
   /**
    * AI Summarized company summary based on website content, 100-150 words long containing the profile of the companies activites, offerings, products and services and USPs.
    */
  objectiveSummaryText?: string
   /**
    * The fully qualified class name of the object
    */
  objectType: typeof CompanyObjectiveSummaryObjectType[keyof typeof CompanyObjectiveSummaryObjectType] 
}
  
  