import {CompanyObjectiveSummary} from '@models/swagger/BeyondSEO/Domain/Seo/Entities/Domains/DomainContent/CompanyObjectiveSummary';

  export const DomainContentObjectType = {
    BeyondSEO_Domain_Seo_Entities_Domains_DomainContent : "BeyondSEO\\Domain\\Seo\\Entities\\Domains\\DomainContent",
  }

export type DomainContent = {
   /**
    * Content extracted from multiple websites
    */
  content?: string
  objectiveSummary?: CompanyObjectiveSummary
   /**
    * The fully qualified class name of the object
    */
  objectType: typeof DomainContentObjectType[keyof typeof DomainContentObjectType] 
}
  
  