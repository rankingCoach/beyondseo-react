import {WPKeywordsAnalysis} from '@models/swagger/BeyondSEO/Domain/Integrations/WordPress/Seo/Entities/WebPages/Content/Elements/ContentAnalysis/WPKeywordsAnalysis';

export type ContentAnalysisResponseDto = {
   /**
    * $postId The post-ID
    */
  postId?: number
   /**
    * $seoScore The calculated SEO score
    */
  seoScore?: number
  keywords?: WPKeywordsAnalysis 
}
  
  