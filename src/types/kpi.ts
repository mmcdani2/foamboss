import { ReactNode } from "react";

export interface KPI {
  title: string;
  visual: ReactNode;
  value: string;
  delta?: string;
  description: string;
}