// src/lib/productivity.ts
// Shared helpers for translating productivity settings into board-foot rates.

import { DEFAULTS, PRODUCTIVITY_MULTIPLIERS } from "./constants";

export type ProductivityCondition = "wide" | "typical" | "tight";

export interface ProductivityResolutionOptions {
  autoProductivity?: boolean;
  overrides?: Partial<Record<ProductivityCondition, number | undefined>>;
}

const multiplierFor = (condition: ProductivityCondition): number =>
  PRODUCTIVITY_MULTIPLIERS[condition] ?? 1;

const normaliseRate = (value: number | undefined): number | undefined => {
  if (typeof value !== "number" || !Number.isFinite(value)) return undefined;
  return value <= 0 ? 0 : value;
};

const resolveBaseRate = (
  baseRate: number | undefined,
  overrides: Partial<Record<ProductivityCondition, number | undefined>>
): number => {
  const direct = normaliseRate(baseRate);
  if (direct !== undefined) return direct;

  const typical = normaliseRate(overrides.typical);
  if (typical !== undefined) return typical;

  return DEFAULTS.productionRateBdFtPerHour;
};

const resolveOverride = (
  overrides: Partial<Record<ProductivityCondition, number | undefined>>,
  condition: ProductivityCondition
): number | undefined => normaliseRate(overrides[condition]);

export const deriveAutoProductivityRates = (
  baseRate: number
): Record<ProductivityCondition, number> => {
  const safeBase = normaliseRate(baseRate);
  const effectiveBase =
    safeBase !== undefined ? safeBase : DEFAULTS.productionRateBdFtPerHour;

  return {
    wide: Math.round(effectiveBase * multiplierFor("wide")),
    typical: Math.round(effectiveBase * multiplierFor("typical")),
    tight: Math.round(effectiveBase * multiplierFor("tight")),
  };
};

export const resolveProductivityRate = (
  condition: ProductivityCondition,
  baseRate: number | undefined,
  options: ProductivityResolutionOptions = {}
): number => {
  const overrides = options.overrides ?? {};
  const base = resolveBaseRate(baseRate, overrides);
  const multiplier = multiplierFor(condition);
  const auto = options.autoProductivity ?? true;
  const nonNegativeBase = Math.max(base, 0);

  if (auto) {
    return nonNegativeBase * multiplier;
  }

  const explicit = resolveOverride(overrides, condition);
  if (explicit !== undefined) {
    return explicit;
  }

  if (condition === "typical") {
    return nonNegativeBase;
  }

  return Math.round(nonNegativeBase * multiplier);
};
