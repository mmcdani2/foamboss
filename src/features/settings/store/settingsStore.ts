import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useEffect, useState } from "react";

// --- TYPES ---
export interface UserSetting {
  id: string;
  name: string;
  role: string;
  status: "Active" | "Inactive";
  hourlyRate?: number;
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
  users: UserSetting[]; // ✅ new
}

export interface SettingsState {
  settings: Settings;
  updateSettings: (data: Partial<Settings>) => void;
  resetSettings: () => void;

  // ✅ user management actions
  addUser: (user: UserSetting) => void;
  updateUser: (id: string, updated: Partial<UserSetting>) => void;
  removeUser: (id: string) => void;
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
        users: [
          { id: "1", name: "John Thornton", role: "Owner", status: "Active", hourlyRate: 0 },
          { id: "2", name: "Alex McDaniel", role: "COO", status: "Active", hourlyRate: 65 },
          { id: "3", name: "Davin Smith", role: "Lead Installer", status: "Inactive", hourlyRate: 30 },
        ],
      },

      updateSettings: (data) => {
        const updated = { ...get().settings, ...data };
        set({ settings: updated });
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
          users: [],
        };
        set({ settings: defaults });
        console.log("⚙️ Settings reset to defaults");
      },

      // --- USER MANAGEMENT ---
      addUser: (user) =>
        set((state) => ({
          settings: { ...state.settings, users: [...state.settings.users, user] },
        })),

      updateUser: (id, updated) =>
        set((state) => ({
          settings: {
            ...state.settings,
            users: state.settings.users.map((u) =>
              u.id === id ? { ...u, ...updated } : u
            ),
          },
        })),

      removeUser: (id) =>
        set((state) => ({
          settings: {
            ...state.settings,
            users: state.settings.users.filter((u) => u.id !== id),
          },
        })),
    }),
    {
      name: "foamboss-settings-storage", // LocalStorage key
      partialize: (state) => ({ settings: state.settings }),
      skipHydration: false,
      version: 2, // ✅ bumped version
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

    if (useSettingsStore.persist.hasHydrated()) setHydrated(true);
    return () => {
      unsub?.();
    };
  }, []);

  return { ...state, hydrated };
};
