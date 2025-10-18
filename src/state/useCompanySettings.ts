// src/state/settings/useCompanySettings.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CompanySettings {
  companyName: string;
  licenseNumber: string;
  address: string;
  phone: string;
  logoUrl?: string; // stored as uploaded file URL or base64 string
}

interface CompanyState {
  company: CompanySettings;
  updateCompany: (data: Partial<CompanySettings>) => void;
  resetCompany: () => void;
}

export const useCompanySettings = create<CompanyState>()(
  persist(
    (set, get) => ({
      company: {
        companyName: "",
        licenseNumber: "",
        address: "",
        phone: "",
        logoUrl: "",
      },

      updateCompany: (data) =>
        set({
          company: {
            ...get().company,
            ...data,
          },
        }),

      resetCompany: () =>
        set({
          company: {
            companyName: "",
            licenseNumber: "",
            address: "",
            phone: "",
            logoUrl: "",
          },
        }),
    }),
    {
      name: "foamboss-company-settings",
      partialize: (state) => ({ company: state.company }),
      version: 1,
    }
  )
);
