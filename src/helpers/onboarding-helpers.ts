import { rcWindow } from "@stores/window.store";

// `isOnboardingCompleted` is localized as the string "true"/"false" on admin
// pages but as a real boolean on the elementor path, so accept both shapes.
export const isOnboardingCompleted = (): boolean => {
  const flag = rcWindow?.rankingCoachReactData?.isOnboardingCompleted;
  return flag === "1" || flag === "true" || flag === true;
};

export const getConnectPageUrl = (): string =>
  `${rcWindow?.rankingCoachReactData?.adminurl || "admin.php"}?page=rankingcoach-connect`;

export const redirectToConnectPage = (): void => {
  window.location.href = getConnectPageUrl();
};
