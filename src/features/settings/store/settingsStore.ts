import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useEffect, useState } from "react";

// --- TYPES ---
export interface Settings {
  companyName: string;
  address: string;
  phone: string;
  licenseNumber: string;
  laborRate: number;
  marginPercent: number;
  mobilizationFee: number;
  includeFuelSurcharge: boolean;
}

export interface SettingsState {
  settings: Settings;
  updateSettings: (data: Partial<Settings>) => void;
  resetSettings: () => void;
}

// --- MAIN STORE ---
export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      settings: {
        companyName: "",
        address: "",
        phone: "",
        licenseNumber: "",
        laborRate: 1.25,
        marginPercent: 25,
        mobilizationFee: 50,
        includeFuelSurcharge: false,
      },

      updateSettings: (data) => {
        const updated = { ...get().settings, ...data };
        set({ settings: updated });

        // Optional debug log
        console.log("✅ Settings updated:", updated);
      },

      resetSettings: () => {
        const defaults = {
          companyName: "",
          address: "",
          phone: "",
          licenseNumber: "",
          laborRate: 1.25,
          marginPercent: 25,
          mobilizationFee: 50,
          includeFuelSurcharge: false,
        };
        set({ settings: defaults });
        console.log("⚙️ Settings reset to defaults");
      },
    }),
    {
      name: "foamboss-settings-storage", // LocalStorage key
      partialize: (state) => ({ settings: state.settings }),
      skipHydration: false,
      version: 1,
    }
  )
);

// --- HYDRATION HELPER ---
export const useHydratedSettings = () => {
  const state = useSettingsStore();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const unsub = useSettingsStore.persist.onFinishHydration(() => {
      setHydrated(true);
    });

    // If store already hydrated (fast reload)
    if (useSettingsStore.persist.hasHydrated()) setHydrated(true);

    return () => {
      unsub?.();
    };
  }, []);

  return { ...state, hydrated };
};
