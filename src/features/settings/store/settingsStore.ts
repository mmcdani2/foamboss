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
  status: "Active" | "Inactive";
  payType: PayType;
  hourlyRate?: number;
  percentageRate?: number;
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
        laborRate: 1.25,
        marginPercent: 25,
        mobilizationFee: 50,
        includeFuelSurcharge: false,
        users: [],
      },

      updateSettings: (data) => {
        const updated = { ...get().settings, ...data };
        set({ settings: updated });
        console.log("✅ Settings updated:", updated);
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
        const defaults = {
          companyName: "",
          address: "",
          phone: "",
          licenseNumber: "",
          laborRate: 1.25,
          marginPercent: 25,
          mobilizationFee: 50,
          includeFuelSurcharge: false,
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
