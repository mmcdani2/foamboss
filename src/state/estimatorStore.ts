import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  calculateJobTotalsFromAssemblies,
  type JobTotalsConfig,
} from "@/lib/estimatorCalculator";


export interface Assembly {
  id: string;
  name: string;
  type: string;
  foamType: "Open-Cell" | "Closed-Cell";
  thickness: number;
  area: number;
  height?: number;
  pitch?: number;
  margin: number;
  laborRate: number;
  mobilization: number;
  boardFeet: number;
  materialCost: number;
  laborCost: number;
  totalCost: number;
  materialName?: string; 
}

export interface Estimate {
  id: string;
  jobName?: string;
  customerName?: string;
  buildingType?: string;
  defaultFoam?: string;
  totalBoardFeet: number;
  totalCost: number;
  subtotalBeforeFees: number;
  materialTotal: number;
  laborTotal: number;
  overheadTotal: number;
  profitTotal: number;
  mobilizationFee: number;
  pricing: JobTotalsConfig;
  createdAt: string;
}

interface EstimatorState {
  estimate: Estimate;
  assemblies: Assembly[];
  addAssembly: (assembly: Assembly, pricing?: JobTotalsConfig) => void;
  removeAssembly: (id: string, pricing?: JobTotalsConfig) => void;
  recalcTotals: (pricing?: JobTotalsConfig) => void;
  resetEstimate: () => void;
  setEstimate: (data: Partial<Estimate>) => void;
  saveEstimate: () => void;
  loadEstimate: (id: string) => void;
}

const createEmptyEstimate = (): Estimate => ({
  id: crypto.randomUUID(),
  totalBoardFeet: 0,
  totalCost: 0,
  subtotalBeforeFees: 0,
  materialTotal: 0,
  laborTotal: 0,
  overheadTotal: 0,
  profitTotal: 0,
  mobilizationFee: 0,
  pricing: {
    mobilizationFee: 0,
  },
  createdAt: new Date().toISOString(),
});

export const useEstimatorStore = create<EstimatorState>()(
  persist(
    (set, get) => ({
      estimate: createEmptyEstimate(),
      assemblies: [],

      addAssembly: (assembly, pricing) => {
        const newAssemblies = [...get().assemblies, assembly];
        set({ assemblies: newAssemblies });
        get().recalcTotals(pricing);
      },

      removeAssembly: (id, pricing) => {
        const newAssemblies = get().assemblies.filter((a) => a.id !== id);
        set({ assemblies: newAssemblies });
        get().recalcTotals(pricing);
      },

      recalcTotals: (pricing) => {
        const assemblies = get().assemblies;
        const existingPricing = get().estimate.pricing ?? {};
        const mergedPricing: JobTotalsConfig = {
          ...existingPricing,
          ...pricing,
        };

        const totals = calculateJobTotalsFromAssemblies(assemblies, mergedPricing);

        set({
          estimate: {
            ...get().estimate,
            totalBoardFeet: totals.totalBoardFeet,
            totalCost: totals.grandTotal,
            subtotalBeforeFees: totals.subtotalWithMargin,
            materialTotal: totals.materialTotal,
            laborTotal: totals.laborTotal,
            overheadTotal: totals.overheadTotal,
            profitTotal: totals.profitTotal,
            mobilizationFee: totals.mobilizationFee,
            pricing: mergedPricing,
          },
        });
      },


      resetEstimate: () => {
        set({
          estimate: createEmptyEstimate(),
          assemblies: [],
        });
      },

      setEstimate: (data) => {
        const current = get().estimate;
        const nextPricing = data.pricing
          ? { ...current.pricing, ...data.pricing }
          : current.pricing;

        set({
          estimate: {
            ...current,
            ...data,
            pricing: nextPricing,
          },
        });
      },

      saveEstimate: () => {
        const saved = JSON.parse(localStorage.getItem("foamboss-saved-estimates") || "[]");
        const current = get().estimate;
        const assemblies = get().assemblies;
        saved.push({ ...current, assemblies });
        localStorage.setItem("foamboss-saved-estimates", JSON.stringify(saved));
        alert("✅ Estimate saved successfully!");
      },

      loadEstimate: (id) => {
        const saved = JSON.parse(localStorage.getItem("foamboss-saved-estimates") || "[]");
        const match = saved.find((e: any) => e.id === id);
        if (match) {
          const {
            assemblies: storedAssemblies = [],
            pricing: storedPricing,
            ...rest
          } = match;

          const empty = createEmptyEstimate();

          set({
            estimate: {
              ...empty,
              ...rest,
              pricing: {
                ...empty.pricing,
                ...(storedPricing ?? {}),
              },
            },
            assemblies: storedAssemblies,
          });
        }
      },
    }),
    {
      name: "foamboss-estimator-storage",
    }
  )
);
