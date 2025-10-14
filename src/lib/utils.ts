// src/lib/utils.ts

/**
 * Round a number to a specified number of decimal places.
 */
export const roundTo = (value: number, decimals = 2): number => {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
};

/**
 * Calculate board feet given area, thickness, and unit type.
 * 
 * @param area - total area (sqft or linear ft)
 * @param thickness - inches
 * @param isLinear - whether the dimension is linear or area-based
 */
export const calculateBoardFeet = (
  area: number,
  thickness: number,
  isLinear = false,
): number => {
  if (isLinear) {
    // For linear footage (e.g., rim joists)
    // Assume 12" width coverage per linear foot by default
    const sqft = area * 1; // can make width configurable later
    return (sqft * thickness) / 12;
  }

  // For square footage calculations
  return (area * thickness) / 12;
};
