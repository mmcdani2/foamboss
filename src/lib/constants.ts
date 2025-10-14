// src/lib/constants.ts

/** -------------------------
 *  DEFAULT CONFIG VALUES
 *  ------------------------- */

export const DEFAULTS = {
  // Labor & Crew
  laborRate: 35,
  crewSize: 2,

  // Material
  materialCostPerBdFt: 0.45, // default fallback (OC)
  mobilizationFee: 50,

  // Financial
  overhead: 10, // percent
  profitMargin: 20, // percent
  defaultMargin: 0.2, // decimal form (for calculations)
  fuelSurchargePerMile: 5,

  // Productivity
  productionRateBdFtPerHour: 900, // default “typical”
  exampleBoardFeet: 1000,
};

/** -------------------------
 *  MATERIAL COSTS
 *  ------------------------- */

export const MATERIAL_COSTS = {
  OC: 0.45, // Open Cell
  CC: 1.0,  // Closed Cell
};

/** -------------------------
 *  PRODUCTIVITY MULTIPLIERS
 *  ------------------------- */

export const PRODUCTIVITY_MULTIPLIERS = {
  wide: 1.4,
  typical: 1.0,
  tight: 0.7,
};
