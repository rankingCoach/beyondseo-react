import {FactorSuggestions} from '@models/swagger/BeyondSEO/Domain/Integrations/WordPress/Seo/Entities/Optimiser/Base/FactorSuggestions';

export type CategorizedSuggestions = {
  primaryKeyword?: FactorSuggestions
  additionalKeywords?: FactorSuggestions
  titleMeta?: FactorSuggestions
  content?: FactorSuggestions
  technical?: FactorSuggestions
  structure?: FactorSuggestions
  backlinks?: FactorSuggestions 
}
  
  