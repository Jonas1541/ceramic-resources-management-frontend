import { GlazeResourceUsage } from "./glaze-resource-usage.model";
import { GlazeMachineUsage } from "./glaze-machine-usage.model";

export interface Glaze {
    id: string;
    createdAt: string;
    updatedAt: string;
    color: string;
    unitValue: number;
    resourceUsages: GlazeResourceUsage[];
    machineUsages: GlazeMachineUsage[];
    unitCost: number;
    currentQuantity: number;
    currentQuantityPrice: number;
}
