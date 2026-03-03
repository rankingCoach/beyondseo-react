

  export const EmailType = {
    EMAIL : "EMAIL",
  }

  export const EmailScope = {
    BUSINESS : "BUSINESS",
  REPORTS : "REPORTS",
  INVOICE : "INVOICE",
  }

  export const EmailObjectType = {
    App_Domain_Common_Entities_ContactInfos_Email : "App\\Domain\\Common\\Entities\\ContactInfos\\Email",
  }

export type Email = {
   /**
    * Email type  
*  Allowed Values:  
* -   `EMAIL`: Contact info type Email
* 
    */
  type: typeof EmailType[keyof typeof EmailType]
   /**
    * Email's scope, e.g. BUSINESS  
*  Allowed Values:  
* -   `BUSINESS`: Business Email Scope
* -   `REPORTS`: Email used for reports
* -   `INVOICE`: Email used for invoices
* 
    */
  scope: typeof EmailScope[keyof typeof EmailScope]
   /**
    * The email itself
    */
  value?: string
   /**
    * The fully qualified class name of the object
    */
  objectType: typeof EmailObjectType[keyof typeof EmailObjectType] 
}
  
  