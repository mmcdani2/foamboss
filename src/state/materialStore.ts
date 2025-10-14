import { create } from "zustand";
import { persist } from "zustand/middleware";

/* ---------- Types ---------- */

export interface Material {
  id: string;
  name: string;
  foamType: "Open-Cell" | "Closed-Cell" | "Roof" | string;
  yieldBdFt: number;       // total board feet per set
  costPerSet: number;      // cost per full set
  costPerBdFt: number;     // derived or manually entered cost
}

export interface MaterialState {
  materials: Material[];
  addMaterial: (mat: Material) => void;
  updateMaterial: (id: string, data: Partial<Material>) => void;
  removeMaterial: (id: string) => void;
  resetMaterials: () => void;
  findByName: (name: string) => Material | undefined;
  recalculateCostPerBdFt: (id: string) => void;
}

/* ---------- Store ---------- */

export const useMaterialStore = create<MaterialState>()(
  persist(
    (set, get) => ({
      materials: [],

      // ➕ Add new material
      addMaterial: (mat) =>
        set({
          materials: [
            ...get().materials,
            { ...mat, id: mat.id || crypto.randomUUID() },
          ],
        }),

      // ✏️ Update existing material
      updateMaterial: (id, data) =>
        set({
          materials: get().materials.map((m) =>
            m.id === id ? { ...m, ...data } : m
          ),
        }),

      // ❌ Remove material
      removeMaterial: (id) =>
        set({
          materials: get().materials.filter((m) => m.id !== id),
        }),

      // 🔁 Reset to empty
      resetMaterials: () => set({ materials: [] }),

      // 🔍 Helper to find by name
      findByName: (name) => get().materials.find((m) => m.name === name),

      // 🧮 Recalculate cost per board foot if yield or cost change
      recalculateCostPerBdFt: (id) => {
        const mat = get().materials.find((m) => m.id === id);
        if (!mat) return;

        const newCost =
          mat.yieldBdFt > 0 ? mat.costPerSet / mat.yieldBdFt : 0;

        set({
          materials: get().materials.map((m) =>
            m.id === id ? { ...m, costPerBdFt: newCost } : m
          ),
        });
      },
    }),
    {
      name: "foamboss-materials-storage",
    }
  )
);
