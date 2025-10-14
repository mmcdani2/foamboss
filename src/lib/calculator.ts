// src/lib/calculator.ts

import { DEFAULTS, MATERIAL_COSTS, PRODUCTIVITY_MULTIPLIERS } from "./constants";
import { roundTo, calculateBoardFeet } from "./utils";

/* ---------- Types ---------- */

export interface AssemblyInput {
  name: string;
  area: number;        
  thickness: number;   
  isLinear?: boolean;  
  materialType: "OC" | "CC";
  condition?: "wide" | "typical" | "tight";
}

export interface AssemblyResult {
  boardFeet: number;
  materialCost: number;
  laborCost: number;
  totalCostBeforeMargin: number;
  totalCostWithMargin: number;
}

export interface JobInput {
  assemblies: AssemblyInput[];
  miles?: number;
  mobilizationFee?: number;
  margin?: number;
  fuelRatePerMile?: number;
}

export interface JobResult {
  assemblies: AssemblyResult[];
  subtotal: number;
  fuelSurcharge: number;
  mobilizationFee: number;
  preMarginTotal: number;
  marginAmount: number;
  grandTotal: number;
}

/* ---------- Core Functions (To Be Implemented Next) ---------- */

export const calculateAssembly = (
  assembly: AssemblyInput,
  config = DEFAULTS
): AssemblyResult => {
  const {
    area,
    thickness,
    isLinear = false,
    materialType,
    condition = "typical",
  } = assembly;

  // 1️⃣ Determine material cost per board foot
  const materialCostPerBdFt =
    MATERIAL_COSTS[materialType] ?? config.materialCostPerBdFt;

  // 2️⃣ Convert area + thickness → board feet
  const boardFeet = calculateBoardFeet(area, thickness, isLinear);

  // 3️⃣ Compute productivity rate for this condition
  const baseProd = config.productionRateBdFtPerHour;
  const productivity =
    baseProd * (PRODUCTIVITY_MULTIPLIERS[condition] ?? 1);

  // 4️⃣ Derive labor cost per board foot
  const laborCostPerBdFt = config.laborRate / productivity;

  // 5️⃣ Compute component costs
  const materialCost = boardFeet * materialCostPerBdFt;
  const laborCost = boardFeet * laborCostPerBdFt * config.crewSize;
  const totalCostBeforeMargin = materialCost + laborCost;

  // 6️⃣ Apply overhead and profit
  const overheadMult = 1 + config.overhead / 100;
  const profitMult = 1 + config.profitMargin / 100;
  const totalCostWithMargin =
    totalCostBeforeMargin * overheadMult * profitMult;

  // 7️⃣ Return rounded results
  return {
    boardFeet: roundTo(boardFeet),
    materialCost: roundTo(materialCost),
    laborCost: roundTo(laborCost),
    totalCostBeforeMargin: roundTo(totalCostBeforeMargin),
    totalCostWithMargin: roundTo(totalCostWithMargin),
  };
};


export const calculateJobTotals = (
  job: JobInput,
  config = DEFAULTS
): JobResult => {
  // 1️⃣ Calculate each assembly using the shared function
  const assemblies = job.assemblies.map((a) => calculateAssembly(a, config));

  // 2️⃣ Subtotal before extras
  const subtotal = assemblies.reduce(
    (sum, a) => sum + a.totalCostBeforeMargin,
    0
  );

  // 3️⃣ Pull job-level overrides or use defaults
  const mobilizationFee = job.mobilizationFee ?? config.mobilizationFee;
  const fuelRatePerMile = job.fuelRatePerMile ?? config.fuelSurchargePerMile;
  const miles = job.miles ?? 0;

  // 4️⃣ Compute additional charges
  const fuelSurcharge = miles * fuelRatePerMile;
  const preMarginTotal = subtotal + mobilizationFee + fuelSurcharge;

  // 5️⃣ Apply margin
  const margin = job.margin ?? config.defaultMargin;
  const grandTotal = preMarginTotal / (1 - margin);
  const marginAmount = grandTotal - preMarginTotal;

  // 6️⃣ Return final, rounded results
  return {
    assemblies,
    subtotal: roundTo(subtotal),
    fuelSurcharge: roundTo(fuelSurcharge),
    mobilizationFee: roundTo(mobilizationFee),
    preMarginTotal: roundTo(preMarginTotal),
    marginAmount: roundTo(marginAmount),
    grandTotal: roundTo(grandTotal),
  };
};


/**
 * Quick “preview” calculator for PricingSettings or demo screens.
 * Uses constants + settings to simulate a 1,000 bdft sample job.
 */
export const calculatePreview = (
  settings: any,
  materialType: "OC" | "CC" = "OC",
  condition: "wide" | "typical" | "tight" = "typical"
) => {
  const exampleBoardFeet = DEFAULTS.exampleBoardFeet;
  const materialCostPerBdFt =
    MATERIAL_COSTS[materialType] ?? settings.materialCostPerBdFt ?? DEFAULTS.materialCostPerBdFt;

  // Productivity multipliers (auto or manual)
  const baseProd = settings.prodTypical ?? DEFAULTS.productionRateBdFtPerHour;
  const productivity =
    settings.autoProductivity
      ? baseProd * (PRODUCTIVITY_MULTIPLIERS[condition] ?? 1)
      : condition === "wide"
        ? settings.prodWideOpen ?? baseProd * 1.4
        : condition === "tight"
          ? settings.prodTight ?? baseProd * 0.7
          : baseProd;

  // Pull labor & finance config
  const laborRate = settings.laborRate ?? DEFAULTS.laborRate;
  const crewSize = settings.crewSize ?? DEFAULTS.crewSize;
  const materialMarkup = settings.materialMarkup ?? 15;
  const mobilizationFee = settings.mobilizationFee ?? DEFAULTS.mobilizationFee;
  const overhead = settings.overhead ?? DEFAULTS.overhead;
  const profitMargin = settings.profitMargin ?? DEFAULTS.profitMargin;

  // Core math
  const rawMaterialCost = exampleBoardFeet * materialCostPerBdFt;
  const markedUpMaterial = rawMaterialCost * (1 + materialMarkup / 100);
  const laborHours = exampleBoardFeet / productivity;
  const laborCost = laborHours * laborRate * crewSize;
  const jobCost = laborCost + markedUpMaterial + mobilizationFee;
  const estimatedSell =
    jobCost * (1 + overhead / 100) * (1 + profitMargin / 100);

  return {
    productivity: roundTo(productivity),
    laborHours: roundTo(laborHours, 1),
    laborCost: roundTo(laborCost),
    markedUpMaterial: roundTo(markedUpMaterial),
    estimatedSell: roundTo(estimatedSell),
    overhead,
    profitMargin,
  };
};

