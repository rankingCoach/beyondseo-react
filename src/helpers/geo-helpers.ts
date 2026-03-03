/**
 * Check if a geocoded address has ROOFTOP precision.
 * Accepts either a JSON string or an already-parsed object.
 */
export type GeoAddressInput = string | { precision?: string; [key: string]: any };

export const hasRooftopPrecision = (geoAddress: GeoAddressInput): boolean => {
  try {
    const geoData = typeof geoAddress === "string" ? JSON.parse(geoAddress) : geoAddress;
    return geoData?.precision === "ROOFTOP";
  } catch {
    return false;
  }
};