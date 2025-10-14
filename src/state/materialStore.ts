import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Material {
  id: string;
  name: string;
  foamType: "Open-Cell" | "Closed-Cell" | "Roof" | string;
  yieldBdFt: number;
  costPerSet: number;
  costPerBdFt: number;
}

export interface MaterialState {
  materials: Material[];
  addMaterial: (mat: Material) => void;
  updateMaterial: (id: string, data: Partial<Material>) => void;
  removeMaterial: (id: string) => void;
  resetMaterials: () => void;
}

export const useMaterialStore = create<MaterialState>()(
  persist(
    (set, get) => ({
      materials: [],

      addMaterial: (mat) =>
        set({ materials: [...get().materials, { ...mat, id: crypto.randomUUID() }] }),

      updateMaterial: (id, data) =>
        set({
          materials: get().materials.map((m) =>
            m.id === id ? { ...m, ...data } : m
          ),
        }),

      removeMaterial: (id) =>
        set({
          materials: get().materials.filter((m) => m.id !== id),
        }),

      resetMaterials: () => set({ materials: [] }),
    }),
    {
      name: "foamboss-materials-storage",
    }
  )
);
