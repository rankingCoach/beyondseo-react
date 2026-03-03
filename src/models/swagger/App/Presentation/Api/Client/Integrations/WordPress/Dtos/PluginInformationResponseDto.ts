import {WPPlugin} from '@models/swagger/App/Domain/Integrations/WordPress/Plugin/Entities/WPPlugin';
import {WPLegacyAccount} from '@models/swagger/App/Domain/Integrations/WordPress/Common/Entities/Accounts/Legacy/WPLegacyAccount';

export type PluginInformationResponseDto = {
  pluginData?: WPPlugin
  userData?: WPLegacyAccount
   /**
    * $rcAccountID The rankingCoach account ID associated with the plugin
    */
  rcAccountId?: number
   /**
    * $rcProjectID The rankingCoach project ID associated with the plugin
    */
  rcProjectId?: number
   /**
    * $subscription The name of the rankingCoach subscription associated with the plugin
    */
  rcSubscriptionName?: string
   /**
    * $rcActivationCode The activation code used for the rankingCoach account
    */
  rcActivationCode?: string
   /**
    * $rcRemainingKeywords The number of remaining keywords available in the rankingCoach account
    */
  rcRemainingKeywords?: number 
}
  
  