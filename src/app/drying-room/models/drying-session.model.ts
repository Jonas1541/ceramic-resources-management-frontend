import { DryingSessionEmployeeUsage } from "./drying-session-employee-usage.model";

export interface DryingSession {
  id: string;
  hours: number;
  createdAt: Date;
  updatedAt: Date;
  employeeUsages: DryingSessionEmployeeUsage[];
  costAtTime: number;
}