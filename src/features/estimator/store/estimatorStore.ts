import { create } from "zustand";
import { useMaterialStore } from "@/features/materials/store/materialStore";

export interface Assembly {
  id: string;
  name: string;
  type: string;
  foamType: string;
  thickness: number;
  area?: number;
  height?: number;
  pitch?: number;
  boardFeet: number;
  materialCost: number;
  laborCost: number;
  totalCost: number;
  margin: number;
}

export interface Estimate {
  id: string;
  jobName?: string;
  customerName?: string;
  buildingType?: string;
  defaultFoam?: string;
  totalBoardFeet: number;
  totalCost: number;
}

export interface EstimatorState {
  estimate: Estimate;
  assemblies: Assembly[];
  addAssembly: (assembly: Assembly) => void;
  removeAssembly: (id: string) => void;
  recalcTotals: () => void;
  resetEstimate: () => void;
  setEstimate: (data: Partial<Estimate>) => void;
}

export const useEstimatorStore = create<EstimatorState>((set, get) => ({
  estimate: {
    id: crypto.randomUUID(),
    totalBoardFeet: 0,
    totalCost: 0,
  },
  assemblies: [],

  addAssembly: (assembly) => {
    const { materials } = useMaterialStore.getState();

    // Get material by foam type
    const selectedMaterial = materials.find(
      (m) => m.foamType === assembly.foamType
    );

    const costPerBdFt = selectedMaterial?.costPerBdFt ?? 0.05; // fallback
    const materialCost = assembly.boardFeet * costPerBdFt;

    const updatedAssembly = {
      ...assembly,
      materialCost,
      totalCost:
        materialCost +
        assembly.laborCost +
        materialCost * (assembly.margin / 100),
    };

    const newAssemblies = [...get().assemblies, updatedAssembly];
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
    const totalBoardFeet = assemblies.reduce(
      (acc, a) => acc + a.boardFeet,
      0
    );
    const totalCost = assemblies.reduce((acc, a) => acc + a.totalCost, 0);
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
}));
