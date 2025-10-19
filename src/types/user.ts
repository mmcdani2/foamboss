export type PayType = "Hourly" | "Percentage" | "Salary" | "None";
export type Team = "Admin" | "Estimators" | "Installers" | "Helpers";

export interface User {
  id: string;
  name: string;
  role: string;
  status: string;
  payType: PayType;
  team: Team;
  email: string;
  hourlyRate?: number;
  percentageRate?: number;
  avatar?: string;
}

export const TEAM_OPTIONS: Team[] = ["Admin", "Estimators", "Installers", "Helpers"];
