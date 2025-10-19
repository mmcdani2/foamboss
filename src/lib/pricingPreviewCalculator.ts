// src/lib/pricingPreviewCalculator.ts

import { DEFAULTS, MATERIAL_COSTS } from "./constants";
import {
  roundTo,
  laborHours as calcLaborHours,
  laborCost as calcLaborCost,
  materialCost as calcMaterialCost,
  applyMarkup,
  applyOverheadAndProfit,
} from "./calculator";
import {
  resolveProductivityRate,
  type ProductivityCondition,
} from "./productivity";

export type MaterialType = "OC" | "CC";
export type Condition = ProductivityCondition;

/** Shape aligned with your Pricing store slice (no framework types here). */
export interface PricingPreviewConfig {
  // Labor
  laborRate: number;               // $/hr per person
  crewSize: number;                // people

  // Productivity (bdft/hr)
  prodTypical: number;
  prodWideOpen: number;
  prodTight: number;
  autoProductivity: boolean;

  // Material ($/bdft) + markup %
  materialOC: number;
  materialCC: number;
  materialMarkup: number;          // %

  // Finance
  overhead: number;                // %
  profitMargin: number;            // %
  mobilizationFee: number;         // $

  // Preview sample size
  exampleBoardFeet?: number;       // defaults to DEFAULTS.exampleBoardFeet
}

/* ---------------------------- Helpers ---------------------------- */

const pickMaterialCost = (cfg: PricingPreviewConfig, type: MaterialType) => {
  const oc = cfg.materialOC ?? MATERIAL_COSTS.OC;
  const cc = cfg.materialCC ?? MATERIAL_COSTS.CC;
  return type === "OC" ? oc : cc;
};

/* ------------------------ Main Calculator ------------------------ */

export const calculatePricingPreview = (
  cfg: PricingPreviewConfig,
  materialType: MaterialType = "OC",
  condition: Condition = "typical"
) => {
  // Use a fixed preview size of board feet
  const boardFeet = cfg.exampleBoardFeet ?? DEFAULTS.exampleBoardFeet;

  // Productivity & labor
  const productivity = resolveProductivityRate(condition, cfg.prodTypical, {
    autoProductivity: cfg.autoProductivity,
    overrides: {
      typical: cfg.prodTypical,
      wide: cfg.prodWideOpen,
      tight: cfg.prodTight,
    },
  });
  const hours = calcLaborHours(boardFeet, productivity);           // hr
  const labor = calcLaborCost(hours, cfg.laborRate, cfg.crewSize); // $

  // Material (raw → markup)
  const costPerBdFt = pickMaterialCost(cfg, materialType);         // $/bdft
  const rawMaterial = calcMaterialCost(boardFeet, costPerBdFt);    // $
  const materialWithMarkup = applyMarkup(rawMaterial, cfg.materialMarkup);

  // Base (before overhead/profit). We include mobilization here so it’s marked up too,
  // matching your prior preview behavior.
  const baseBeforeMargin = materialWithMarkup + labor + cfg.mobilizationFee;

  // Overhead & profit
  const sellPrice = applyOverheadAndProfit(
    baseBeforeMargin,
    cfg.overhead,
    cfg.profitMargin
  );

  return {
    boardFeet,
    productivity: roundTo(productivity),
    laborHours: roundTo(hours, 1),
    laborCost: roundTo(labor),
    markedUpMaterial: roundTo(materialWithMarkup),
    estimatedSell: roundTo(sellPrice),
    overhead: cfg.overhead,
    profitMargin: cfg.profitMargin,
  };
};
