

  export const CMSTypeObjectType = {
    BeyondSEO_Domain_Seo_Entities_CMSTypes_CMSType : "BeyondSEO\\Domain\\Seo\\Entities\\CMSTypes\\CMSType",
  }

export type CMSType = {
   /**
    * The name of the CMS
    */
  name?: string
   /**
    * The alias of the CMS
    */
  displayName?: string
   /**
    * The priority of the CMS
    */
  priority?: number
   /**
    * Whether the CMS is enabled or not
    */
  active?: boolean
   /**
    * The img name or url of the CMS
    */
  img?: string
   /**
    * The alias of the CMS
    */
  alias?: string
   /**
    * The CSS class of the CMS
    */
  class?: string
   /**
    * The version of the CMS
    */
  version?: string
   /**
    * Whether the CMS is shown on public pages
    */
  showOnPublic?: boolean
   /**
    * Whether the CMS is an online shop
    */
  isOnlineShop?: boolean
   /**
    * The detection name of the CMS
    */
  cmsDetectionName?: string
   /**
    * The fully qualified class name of the object
    */
  objectType: typeof CMSTypeObjectType[keyof typeof CMSTypeObjectType] 
}
  
  