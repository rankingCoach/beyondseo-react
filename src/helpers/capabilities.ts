import { rcWindow } from "@stores/window.store";

/**
 * What the current WordPress user may do, localized by Assets::getCapabilitiesData() into
 * `window.rankingCoachReactData.capabilities`. Mirrors the REST permission callbacks so the UI
 * can hide what the server would refuse; missing data means "no".
 */
interface Capabilities {
  /** Capabilities::MANAGE in PHP: plugin pages, settings, account, redirects (administrators and editors). */
  managePlugin?: boolean;
}

const getCapabilities = (): Capabilities => rcWindow?.rankingCoachReactData?.capabilities || {};

export const canManagePlugin = (): boolean => getCapabilities().managePlugin === true;
