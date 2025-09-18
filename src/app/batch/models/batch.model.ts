import { BatchResourceUsage } from "./batch-resource-usage.model";
import { BatchMachineUsage } from "./batch-machine-usage.model";
import { BatchEmployeeUsage } from "./batch-employee-usage.model";

export interface Batch {
    id: string;
    createdAt: string;
    updatedAt: string;
    resourceUsages: BatchResourceUsage[];
    machineUsages: BatchMachineUsage[];
    employeeUsages: BatchEmployeeUsage[];
    batchTotalWater: number;
    batchTotalWaterCost: number;
    resourceTotalQuantity: number;
    resourceTotalCost: number;
    machinesEnergyConsumption: number;
    machinesEnergyConsumptionCost: number;
    employeeTotalCost: number;
    batchFinalCost: number;
}
