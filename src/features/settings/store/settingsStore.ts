// src/features/settings/store/settingsStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useEffect, useState } from "react";

// ─── TYPES ────────────────────────────────────────────────────────────
export type PayType = "Hourly" | "Percentage" | "Salary" | "None";

export interface UserSetting {
  id: string;
  name: string;
  role: string;
  status: "Active" | "Inactive" | "Paused" | "Vacation";
  payType: PayType;
  hourlyRate?: number;
  percentageRate?: number;
  email?: string;
}

export interface Settings {
  companyName: string;
  address: string;
  phone: string;
  licenseNumber: string;
  laborRate: number;
  marginPercent: number;
  mobilizationFee: number;
  includeFuelSurcharge: boolean;
  prodTypical: number;
  prodWideOpen: number;
  prodTight: number;
  autoProductivity: boolean;
  crewSize: number;
  materialOC: number;
  materialCC: number;
  materialMarkup: number;
  overhead: number;
  profitMargin: number;
  users: UserSetting[];
}

export interface SettingsState {
  settings: Settings;
  updateSettings: (data: Partial<Settings>) => void;
  addUser: (user: UserSetting) => void;
  updateUser: (id: string, data: Partial<UserSetting>) => void;
  removeUser: (id: string) => void;
  resetSettings: () => void;
}

// ─── STORE ───────────────────────────────────────────────────────────
export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      settings: {
        companyName: "",
        address: "",
        phone: "",
        licenseNumber: "",
        laborRate: 35,
        marginPercent: 25,
        mobilizationFee: 50,
        includeFuelSurcharge: false,
        prodTypical: 900,
        prodWideOpen: 1260,
        prodTight: 630,
        autoProductivity: true,
        crewSize: 3,
        materialOC: 0.45,
        materialCC: 1.0,
        materialMarkup: 15,
        overhead: 10,
        profitMargin: 20,
        users: [],
      },

      updateSettings: (data) => {
        const current = get().settings;
        const merged = { ...current, ...data };

        // Apply auto productivity logic only if enabled
        if (
          merged.autoProductivity &&
          data.prodTypical &&
          !data.prodWideOpen &&
          !data.prodTight
        ) {
          merged.prodWideOpen = Math.round(data.prodTypical * 1.4);
          merged.prodTight = Math.round(data.prodTypical * 0.7);
        }

        set({ settings: merged });
        console.log("✅ Settings updated:", merged);
      },

      addUser: (user) => {
        set({
          settings: {
            ...get().settings,
            users: [...get().settings.users, user],
          },
        });
      },

      updateUser: (id, data) => {
        set({
          settings: {
            ...get().settings,
            users: get().settings.users.map((u) =>
              u.id === id ? { ...u, ...data } : u
            ),
          },
        });
      },

      removeUser: (id) => {
        set({
          settings: {
            ...get().settings,
            users: get().settings.users.filter((u) => u.id !== id),
          },
        });
      },

      resetSettings: () => {
        const defaults: Settings = {
          companyName: "",
          address: "",
          phone: "",
          licenseNumber: "",
          laborRate: 35,
          marginPercent: 25,
          mobilizationFee: 50,
          includeFuelSurcharge: false,
          prodTypical: 900,
          prodWideOpen: 1260,
          prodTight: 630,
          autoProductivity: true,
          crewSize: 3, 
          materialOC: 0.45, 
          materialCC: 1.0, 
          materialMarkup: 15, 
          overhead: 10, 
          profitMargin: 20, 
          users: [],
        };

        set({ settings: defaults });
        console.log("⚙️ Settings reset to defaults");
      },
    }),
    {
      name: "foamboss-settings-storage",
      partialize: (state) => ({ settings: state.settings }),
      skipHydration: false,
      version: 2,
    }
  )
);

// ─── HYDRATION HOOK ─────────────────────────────────────────────────
export const useHydratedSettings = () => {
  const state = useSettingsStore();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const unsub = useSettingsStore.persist.onFinishHydration(() =>
      setHydrated(true)
    );
    if (useSettingsStore.persist.hasHydrated()) setHydrated(true);
    return () => unsub?.();
  }, []);

  return { ...state, hydrated };
};
