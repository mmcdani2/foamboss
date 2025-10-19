import {
  roundTo,
  wallBoardFeet,
  atticRoofBoardFeet,
  flatAreaBoardFeet,
  linearBoardFeet,
  laborHours as calcLaborHours,
  laborCost as calcLaborCost,
  materialCost as calcMaterialCost,
  applyMarkup,
  applyOverheadAndProfit,
} from "./calculator";
import { DEFAULTS, MATERIAL_COSTS } from "./constants";
import {
  resolveProductivityRate,
  type ProductivityCondition,
} from "./productivity";

/* -------------------- Types -------------------- */

export type Condition = ProductivityCondition;
export type MaterialType = "OC" | "CC";

export type GeometryKind = "wall" | "attic" | "flat" | "linear";

export interface BaseAssemblyInput {
  name: string;
  materialType?: MaterialType; // optional if you pass materialCostPerBdFt
  materialCostPerBdFt?: number; // overrides materialType default if provided
  thicknessInches: number;
  condition?: Condition; // productivity condition
}

export interface WallAssemblyInput extends BaseAssemblyInput {
  kind: "wall";
  linearFeet: number;
  heightFeet: number;
}

export interface AtticAssemblyInput extends BaseAssemblyInput {
  kind: "attic";
  areaSqft: number;
  pitch: number; // e.g., 4 (for 4/12) or a precomputed multiplier
  pitchIsRiseOver12?: boolean; // default true => 4 means 4/12
}

export interface FlatAssemblyInput extends BaseAssemblyInput {
  kind: "flat";
  areaSqft: number;
}

export interface LinearAssemblyInput extends BaseAssemblyInput {
  kind: "linear";
  linearFeet: number;
  sprayWidthInches: number; // width of the spray band
}

export type AssemblyInput =
  | WallAssemblyInput
  | AtticAssemblyInput
  | FlatAssemblyInput
  | LinearAssemblyInput;

export interface AssemblyResult {
  name: string;
  kind: GeometryKind;
  boardFeet: number;
  laborHours: number;
  materialCost: number; // with markup applied
  laborCost: number;
  totalBeforeMargin: number; // material(with markup) + labor
  totalWithMargin: number; // after overhead + profit
}

export interface EstimatorConfig {
  // Labor & Crew
  laborRatePerHour?: number; // $/hr (per tech)
  crewSize?: number;

  // Material
  materialMarkupPct?: number; // % markup applied to raw material
  materialCosts?: Partial<Record<MaterialType, number>>;

  // Financial
  overheadPct?: number; // %
  profitPct?: number; // %
  mobilizationFee?: number; // flat $

  // Productivity
  autoProductivity?: boolean;
  prodTypical?: number; // bdft/hr
  prodWideOpen?: number; // bdft/hr
  prodTight?: number; // bdft/hr
}

export interface EstimateTotals {
  assemblies: AssemblyResult[];
  subtotalBeforeFees: number; // sum of totalBeforeMargin (or totalWithMargin)? -> before fees, after O&P per-assembly
  mobilizationFee: number;
  fuelSurcharge: number;
  preGrandTotal: number; // subtotal + fees (already has O&P if applied at assembly level)
  grandTotal: number; // same as preGrandTotal (kept for API symmetry / future use)
}

export interface AssemblyJobTotalsInput {
  boardFeet: number;
  materialCost: number;
  laborCost: number;
}

export interface JobTotalsConfig {
  mobilizationFee?: number;
  overheadPct?: number;
  profitPct?: number;
}

export interface JobTotalsResult {
  totalBoardFeet: number;
  materialTotal: number;
  laborTotal: number;
  overheadTotal: number;
  profitTotal: number;
  subtotalWithMargin: number;
  mobilizationFee: number;
  grandTotal: number;
}

/* -------------------- Helpers -------------------- */

const pickMaterialCost = (
  materialType: MaterialType | undefined,
  overridePerBdFt: number | undefined,
  config: EstimatorConfig
): number => {
  if (typeof overridePerBdFt === "number") return overridePerBdFt;
  if (materialType) {
    const fromCfg = config.materialCosts?.[materialType];
    if (typeof fromCfg === "number") return fromCfg;
    return MATERIAL_COSTS[materialType]; // from constants
  }
  // Fallback to OC default if nothing specified
  return MATERIAL_COSTS.OC;
};

const getProductionRate = (
  condition: Condition | undefined,
  cfg: EstimatorConfig
): number =>
  resolveProductivityRate(condition ?? "typical", cfg.prodTypical, {
    autoProductivity: cfg.autoProductivity,
    overrides: {
      typical: cfg.prodTypical,
      wide: cfg.prodWideOpen,
      tight: cfg.prodTight,
    },
  });

const boardFeetForAssembly = (a: AssemblyInput): number => {
  switch (a.kind) {
    case "wall":
      return wallBoardFeet(a.linearFeet, a.heightFeet, a.thicknessInches);
    case "attic":
      return atticRoofBoardFeet(
        a.areaSqft,
        a.pitch,
        a.thicknessInches,
        a.pitchIsRiseOver12 ?? true
      );
    case "flat":
      return flatAreaBoardFeet(a.areaSqft, a.thicknessInches);
    case "linear":
      return linearBoardFeet(
        a.linearFeet,
        a.sprayWidthInches,
        a.thicknessInches
      );
  }
};

/* -------------------- Public API -------------------- */

/**
 * Calculate a single assembly’s totals using composition (primitives + config/defaults).
 * - Applies material markup (if provided in config).
 * - Applies overhead & profit (O&P) at the assembly level.
 */
export const calculateAssembly = (
  input: AssemblyInput,
  config: EstimatorConfig = {}
): AssemblyResult => {
  const laborRatePerHour = config.laborRatePerHour ?? DEFAULTS.laborRate;
  const crewSize = config.crewSize ?? DEFAULTS.crewSize;
  const materialMarkupPct = config.materialMarkupPct ?? 0;
  const overheadPct = config.overheadPct ?? DEFAULTS.overhead;
  const profitPct = config.profitPct ?? DEFAULTS.profitMargin;

  const boardFeet = boardFeetForAssembly(input);
  const productionRate = getProductionRate(input.condition, config);

  const hours = calcLaborHours(boardFeet, productionRate);
  const labor = calcLaborCost(hours, laborRatePerHour, crewSize);

  const costPerBdFt = pickMaterialCost(
    input.materialType,
    input.materialCostPerBdFt,
    config
  );
  const rawMat = calcMaterialCost(boardFeet, costPerBdFt);
  const matWithMarkup = applyMarkup(rawMat, materialMarkupPct);

  const beforeMargin = matWithMarkup + labor;
  const withMargin = applyOverheadAndProfit(
    beforeMargin,
    overheadPct,
    profitPct
  );

  return {
    name: input.name,
    kind: input.kind,
    boardFeet: roundTo(boardFeet, 2),
    laborHours: roundTo(hours, 2),
    materialCost: roundTo(matWithMarkup, 2),
    laborCost: roundTo(labor, 2),
    totalBeforeMargin: roundTo(beforeMargin, 2),
    totalWithMargin: roundTo(withMargin, 2),
  };
};

/**
 * Calculate a full estimate across assemblies, then apply fees/surcharges.
 * Assumes O&P is already applied per-assembly via calculateAssembly (above),
 * so fees are simply added to the sum.
 */
export const calculateEstimateTotals = (
  assemblies: AssemblyInput[],
  options?: {
    config?: EstimatorConfig;
    miles?: number;
    fuelRatePerMile?: number; // optional; use DEFAULTS if wanted
    mobilizationFeeOverride?: number;
  }
): EstimateTotals => {
  const cfg = options?.config ?? {};
  const perAssembly = assemblies.map((a) => calculateAssembly(a, cfg));

  // Sum *after* O&P since each assembly result is already withMargin.
  const subtotalWithMargin = perAssembly.reduce(
    (sum, r) => sum + r.totalWithMargin,
    0
  );

  const mobilizationFee =
    typeof options?.mobilizationFeeOverride === "number"
      ? options!.mobilizationFeeOverride
      : cfg.mobilizationFee ?? DEFAULTS.mobilizationFee;

  const miles = options?.miles ?? 0;
  const fuelRate = options?.fuelRatePerMile ?? DEFAULTS.fuelSurchargePerMile;
  const fuelSurcharge = miles * fuelRate;

  const preGrandTotal = subtotalWithMargin + mobilizationFee + fuelSurcharge;

  return {
    assemblies: perAssembly,
    subtotalBeforeFees: roundTo(subtotalWithMargin, 2),
    mobilizationFee: roundTo(mobilizationFee, 2),
    fuelSurcharge: roundTo(fuelSurcharge, 2),
    preGrandTotal: roundTo(preGrandTotal, 2),
    grandTotal: roundTo(preGrandTotal, 2),
  };
};

/**
 * Aggregate existing assembly cost breakdowns into job-level totals.
 * Expects materialCost to already include markup and laborCost to be raw labor.
 * Applies overhead and profit percentages uniformly across all assemblies, then
 * adds mobilization to produce the final grand total.
 */
export const calculateJobTotalsFromAssemblies = (
  assemblies: AssemblyJobTotalsInput[],
  config: JobTotalsConfig = {}
): JobTotalsResult => {
  const overheadPct = config.overheadPct ?? DEFAULTS.overhead;
  const profitPct = config.profitPct ?? DEFAULTS.profitMargin;
  const mobilizationFee = config.mobilizationFee ?? DEFAULTS.mobilizationFee;

  const totals = assemblies.reduce(
    (acc, asm) => {
      const boardFeet = Number.isFinite(asm.boardFeet) ? asm.boardFeet : 0;
      const material = Number.isFinite(asm.materialCost) ? asm.materialCost : 0;
      const labor = Number.isFinite(asm.laborCost) ? asm.laborCost : 0;
      const base = material + labor;
      const overhead = base * (overheadPct || 0) / 100;
      const profit = (base + overhead) * (profitPct || 0) / 100;
      const subtotal = base + overhead + profit;

      acc.boardFeet += boardFeet;
      acc.material += material;
      acc.labor += labor;
      acc.overhead += overhead;
      acc.profit += profit;
      acc.subtotal += subtotal;

      return acc;
    },
    {
      boardFeet: 0,
      material: 0,
      labor: 0,
      overhead: 0,
      profit: 0,
      subtotal: 0,
    }
  );

  const grandTotal = totals.subtotal + mobilizationFee;

  return {
    totalBoardFeet: roundTo(totals.boardFeet, 2),
    materialTotal: roundTo(totals.material, 2),
    laborTotal: roundTo(totals.labor, 2),
    overheadTotal: roundTo(totals.overhead, 2),
    profitTotal: roundTo(totals.profit, 2),
    subtotalWithMargin: roundTo(totals.subtotal, 2),
    mobilizationFee: roundTo(mobilizationFee, 2),
    grandTotal: roundTo(grandTotal, 2),
  };
};
