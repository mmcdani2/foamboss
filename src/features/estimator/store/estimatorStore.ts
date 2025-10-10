import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useSettingsStore } from "@/features/settings/store/settingsStore";


export interface Assembly {
  id: string;
  name: string;
  type: string;
  foamType: string;
  thickness: number;
  area: number;
  height: number;
  pitch: number;
  margin: number;
  laborRate: number;
  mobilization: number;
  boardFeet: number;
  materialCost: number;
  laborCost: number;
  totalCost: number;
}

export interface Estimate {
  id: string;
  jobName?: string;
  customerName?: string;
  buildingType?: string;
  defaultFoam?: string;
  totalBoardFeet: number;
  totalCost: number;
  createdAt: string;
}

interface EstimatorState {
  estimate: Estimate;
  assemblies: Assembly[];
  addAssembly: (assembly: Assembly) => void;
  removeAssembly: (id: string) => void;
  recalcTotals: () => void;
  resetEstimate: () => void;
  setEstimate: (data: Partial<Estimate>) => void;
  saveEstimate: () => void;
  loadEstimate: (id: string) => void;
}

export const useEstimatorStore = create<EstimatorState>()(
  persist(
    (set, get) => ({
      estimate: {
        id: crypto.randomUUID(),
        totalBoardFeet: 0,
        totalCost: 0,
        createdAt: new Date().toISOString(),
      },
      assemblies: [],

      addAssembly: (assembly) => {
        const newAssemblies = [...get().assemblies, assembly];
        set({ assemblies: newAssemblies });
        get().recalcTotals();
      },

      removeAssembly: (id) => {
        const newAssemblies = get().assemblies.filter((a) => a.id !== id);
        set({ assemblies: newAssemblies });
        get().recalcTotals();
      },

      recalcTotals: () => {
        const assemblies = get().assemblies;
        const totalBoardFeet = assemblies.reduce((sum, a) => sum + a.boardFeet, 0);
        const totalCostWithoutMobilization = assemblies.reduce((sum, a) => sum + a.totalCost, 0);

        const mobilization = useSettingsStore.getState().settings.mobilizationFee || 0;
        const totalCost = totalCostWithoutMobilization + mobilization;

        set({
          estimate: {
            ...get().estimate,
            totalBoardFeet,
            totalCost,
          },
        });
      },


      resetEstimate: () => {
        set({
          estimate: {
            id: crypto.randomUUID(),
            totalBoardFeet: 0,
            totalCost: 0,
            createdAt: new Date().toISOString(),
          },
          assemblies: [],
        });
      },

      setEstimate: (data) => {
        set({
          estimate: {
            ...get().estimate,
            ...data,
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
          set({
            estimate: match,
            assemblies: match.assemblies || [],
          });
        }
      },
    }),
    {
      name: "foamboss-estimator-storage",
    }
  )
);
