// src/lib/calculator.ts
//
// Primitive math utilities for spray foam estimating.
// No framework/state/config awareness — pure functions only.
//

/** Convert thickness in inches to feet. */
export const inchesToFeet = (inches: number): number => inches / 12;

/** Board feet from area in sqft and thickness in inches. */
export const boardFeetFromSqft = (areaSqft: number, thicknessInches: number): number =>
  areaSqft * inchesToFeet(thicknessInches);

/** Board feet for walls from linear feet, height (ft), thickness (in). */
export const wallBoardFeet = (
  linearFeet: number,
  heightFeet: number,
  thicknessInches: number
): number => boardFeetFromSqft(linearFeet * heightFeet, thicknessInches);

/**
 * Pitch multiplier helper.
 * - If you pass a common roof pitch like 4 (for 4/12), set `pitchIsRiseOver12=true`.
 * - If you already have a multiplier (e.g., 1.15), set `pitchIsRiseOver12=false`.
 */
export const pitchMultiplier = (pitch: number, pitchIsRiseOver12 = true): number => {
  if (!pitchIsRiseOver12) return pitch;
  // Simple rise/12 hypotenuse approximation:
  const rise = pitch;
  const run = 12;
  return Math.sqrt(rise * rise + run * run) / run;
};

/** Board feet for attic/roof deck from plan-area sqft, pitch, thickness. */
export const atticRoofBoardFeet = (
  areaSqft: number,
  pitch: number,
  thicknessInches: number,
  pitchIsRiseOver12 = true
): number => boardFeetFromSqft(areaSqft * pitchMultiplier(pitch, pitchIsRiseOver12), thicknessInches);

/** Board feet for flat areas (ceilings, slabs, etc.). */
export const flatAreaBoardFeet = (areaSqft: number, thicknessInches: number): number =>
  boardFeetFromSqft(areaSqft, thicknessInches);

/**
 * Linear feature board feet (e.g., rim joists).
 * Assumes a default spray width (inches) across the linear length.
 */
export const linearBoardFeet = (
  linearFeet: number,
  sprayWidthInches: number,
  thicknessInches: number
): number => boardFeetFromSqft(linearFeet * (sprayWidthInches / 12), thicknessInches);

/** Sum an array of board-feet values safely. */
export const sumBoardFeet = (values: number[]): number =>
  values.reduce((acc, v) => acc + (Number.isFinite(v) ? v : 0), 0);

/** Labor hours from board feet and production rate (bdft/hr). */
export const laborHours = (boardFeet: number, productionRateBdFtPerHour: number): number =>
  productionRateBdFtPerHour > 0 ? boardFeet / productionRateBdFtPerHour : 0;

/** Labor cost given hours, $/hr, and crew size. */
export const laborCost = (hours: number, ratePerHour: number, crewSize: number): number =>
  hours * ratePerHour * crewSize;

/** Material cost given board feet and $/bdft (raw, before markup). */
export const materialCost = (boardFeet: number, costPerBdFt: number): number =>
  boardFeet * costPerBdFt;

/** Apply a percentage markup (e.g., 20 => +20%). */
export const applyMarkup = (value: number, percent: number): number =>
  value * (1 + (percent || 0) / 100);

/** Apply overhead then profit as separate percentages. */
export const applyOverheadAndProfit = (
  baseCost: number,
  overheadPercent: number,
  profitPercent: number
): number => {
  const withOverhead = baseCost * (1 + (overheadPercent || 0) / 100);
  return withOverhead * (1 + (profitPercent || 0) / 100);
};

/**
 * Convenience: compute assembly totals from primitives.
 * Still “primitive” in that all inputs are raw numbers (no config/state).
 */
export const computeAssemblyTotals = (args: {
  boardFeet: number;
  costPerBdFt: number;     // raw material $/bdft (before markup)
  materialMarkupPct: number;
  productionRateBdFtPerHour: number;
  laborRatePerHour: number;
  crewSize: number;
  overheadPct: number;
  profitPct: number;
}) => {
  const rawMat = materialCost(args.boardFeet, args.costPerBdFt);
  const matWithMarkup = applyMarkup(rawMat, args.materialMarkupPct);
  const hrs = laborHours(args.boardFeet, args.productionRateBdFtPerHour);
  const labor = laborCost(hrs, args.laborRatePerHour, args.crewSize);
  const beforeMargin = matWithMarkup + labor;
  const withMargin = applyOverheadAndProfit(beforeMargin, args.overheadPct, args.profitPct);

  return {
    materialCost: matWithMarkup,
    laborCost: labor,
    totalBeforeMargin: beforeMargin,
    totalWithMargin: withMargin,
    laborHours: hrs,
  };
};
