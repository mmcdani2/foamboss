// src/state/settings/usePricingSettings.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { deriveAutoProductivityRates } from "@/lib/productivity";

/** Domain model for Pricing Settings */
export interface PricingSettings {
  // Labor
  laborRate: number;        // $/hr per person
  crewSize: number;         // people

  // Productivity (bdft/hr)
  prodTypical: number;
  prodWideOpen: number;
  prodTight: number;
  autoProductivity: boolean; // if true, wide/tight mirror typical with multipliers

  // Material ($/bdft)
  materialOC: number;
  materialCC: number;
  materialMarkup: number;    // %

  // Finance
  overhead: number;          // %
  profitMargin: number;      // %
  mobilizationFee: number;   // $
}

/** Store shape */
interface PricingState {
  pricing: PricingSettings;
  updatePricing: (data: Partial<PricingSettings>) => void;
  resetPricing: () => void;
}

/** Centralized defaults */
const DEFAULT_TYPICAL = 1000;
const DEFAULT_AUTO = deriveAutoProductivityRates(DEFAULT_TYPICAL);

const DEFAULTS: PricingSettings = {
  // Labor
  laborRate: 50,
  crewSize: 2,

  // Productivity
  prodTypical: DEFAULT_TYPICAL,
  prodWideOpen: DEFAULT_AUTO.wide, // derived from multipliers
  prodTight: DEFAULT_AUTO.tight,   // derived from multipliers
  autoProductivity: true,

  // Material
  materialOC: 0.10,
  materialCC: 0.50,
  materialMarkup: 20,

  // Finance
  overhead: 18,
  profitMargin: 25,
  mobilizationFee: 150,
};

const clampPositive = (n: number, min = 0) => (isFinite(n) && n >= min ? n : min);

/** Zustand slice */
export const usePricingSettings = create<PricingState>()(
  persist(
    (set, get) => ({
      pricing: { ...DEFAULTS },

      updatePricing: (data) => {
        const current = get().pricing;
        const merged: PricingSettings = {
          ...current,
          ...data,
        };

        // Normalize numeric fields defensively (prevents NaN creeping in)
        merged.laborRate      = clampPositive(+merged.laborRate);
        merged.crewSize       = Math.max(1, Math.floor(+merged.crewSize || 1));

        merged.prodTypical    = clampPositive(+merged.prodTypical);
        merged.prodWideOpen   = clampPositive(+merged.prodWideOpen);
        merged.prodTight      = clampPositive(+merged.prodTight);

        merged.materialOC     = clampPositive(+merged.materialOC);
        merged.materialCC     = clampPositive(+merged.materialCC);
        merged.materialMarkup = clampPositive(+merged.materialMarkup);

        merged.overhead       = clampPositive(+merged.overhead);
        merged.profitMargin   = clampPositive(+merged.profitMargin);
        merged.mobilizationFee= clampPositive(+merged.mobilizationFee);

        // Auto-productivity rule:
        // If auto is ON and user changed prodTypical (without explicitly
        // providing new wide/tight), recompute wide/tight from typical.
        const prodTypicalChanged = Object.prototype.hasOwnProperty.call(data, "prodTypical");
        const autoToggledOn = Object.prototype.hasOwnProperty.call(data, "autoProductivity")
          ? !!data.autoProductivity
          : merged.autoProductivity;

        if (
          autoToggledOn &&
          !Object.prototype.hasOwnProperty.call(data, "prodWideOpen") &&
          !Object.prototype.hasOwnProperty.call(data, "prodTight") &&
          (prodTypicalChanged ||
            Object.prototype.hasOwnProperty.call(data, "autoProductivity"))
        ) {
          const autoRates = deriveAutoProductivityRates(merged.prodTypical);
          merged.prodWideOpen = autoRates.wide;
          merged.prodTight = autoRates.tight;
        }

        set({ pricing: merged });
      },

      resetPricing: () => set({ pricing: { ...DEFAULTS } }),
    }),
    {
      name: "foamboss-pricing-settings",
      version: 1,
      partialize: (s) => ({ pricing: s.pricing }),
    }
  )
);
