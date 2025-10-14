// src/lib/utils.ts

/**
 * Round a number to a specified number of decimal places.
 */
export const roundTo = (value: number, decimals = 2): number => {
  if (isNaN(value) || value === null || value === undefined) return 0;
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
};

/**
 * Calculate board feet given area, thickness, and unit type.
 * Includes optional roof pitch adjustment.
 *
 * @param area - total area (sqft or linear ft)
 * @param thickness - inches
 * @param isLinear - whether the dimension is linear or area-based
 * @param linearWidthInches - assumed spray width per linear foot (default 12")
 * @param pitch - roof pitch (rise per 12 inches run)
 */
export const calculateBoardFeet = (
  area: number,
  thickness: number,
  isLinear = false,
  linearWidthInches = 12,
  pitch?: number
): number => {
  if (isNaN(area) || isNaN(thickness) || area <= 0 || thickness <= 0) return 0;

  // ✅ Pitch adjustment multiplier
  const pitchMultiplier = pitch ? Math.sqrt(1 + Math.pow(pitch / 12, 2)) : 1;

  if (isLinear) {
    const sqft = (area * linearWidthInches) / 12;
    return (sqft * thickness * pitchMultiplier) / 12;
  }

  return (area * thickness * pitchMultiplier) / 12;
};

