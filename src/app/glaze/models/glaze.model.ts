import { GlazeResourceUsage } from "./glaze-resource-usage.model";
import { GlazeMachineUsage } from "./glaze-machine-usage.model";
import { GlazeEmployeeUsage } from "./glaze-employee-usage.model";

export interface Glaze {
    id: string;
    createdAt: string;
    updatedAt: string;
    color: string;
    resourceUsages: GlazeResourceUsage[];
    machineUsages: GlazeMachineUsage[];
    employeeUsages: GlazeEmployeeUsage[];
    employeeTotalCost: number;
    unitCost: number;
    currentQuantity: number;
    currentQuantityPrice: number;
}
