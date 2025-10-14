// src/lib/calculator.ts

import { DEFAULTS } from "./constants";
import { calculateBoardFeet, roundTo } from "./utils";

/* ---------- Types ---------- */

export interface AssemblyInput {
  name: string;
  area: number;        // sqft or linear ft
  thickness: number;   // inches
  isLinear?: boolean;  // determines how area is interpreted
  materialCostPerBdFt?: number;
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

/* ---------- Assembly-Level Calculation ---------- */

export const calculateAssembly = (
  assembly: AssemblyInput,
  config = DEFAULTS
): AssemblyResult => {
  const {
    area,
    thickness,
    isLinear = false,
    materialCostPerBdFt = config.materialCostPerBdFt,
  } = assembly;

  const boardFeet = calculateBoardFeet(area, thickness, isLinear);
  const materialCost = boardFeet * materialCostPerBdFt;

  const laborCostPerBdFt = config.crewRatePerHour / config.productionRateBdFtPerHour;
  const laborCost = boardFeet * laborCostPerBdFt;

  const totalCostBeforeMargin = materialCost + laborCost;
  const totalCostWithMargin = totalCostBeforeMargin / (1 - config.defaultMargin);

  return {
    boardFeet: roundTo(boardFeet),
    materialCost: roundTo(materialCost),
    laborCost: roundTo(laborCost),
    totalCostBeforeMargin: roundTo(totalCostBeforeMargin),
    totalCostWithMargin: roundTo(totalCostWithMargin),
  };
};

/* ---------- Job-Level Totals ---------- */

export const calculateJobTotals = (
  job: JobInput,
  config = DEFAULTS
): JobResult => {
  const assemblies = job.assemblies.map((a) => calculateAssembly(a, config));

  const subtotal = assemblies.reduce(
    (sum, a) => sum + a.totalCostBeforeMargin,
    0
  );

  const mobilizationFee = job.mobilizationFee ?? config.mobilizationFee;
  const fuelRatePerMile = job.fuelRatePerMile ?? config.fuelSurchargePerMile;
  const miles = job.miles ?? 0;
  const fuelSurcharge = miles * fuelRatePerMile;

  const preMarginTotal = subtotal + mobilizationFee + fuelSurcharge;
  const margin = job.margin ?? config.defaultMargin;
  const grandTotal = preMarginTotal / (1 - margin);
  const marginAmount = grandTotal - preMarginTotal;

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
