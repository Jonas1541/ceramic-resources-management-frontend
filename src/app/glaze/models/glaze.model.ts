import { GlazeResourceUsage } from "./glaze-resource-usage.model";
import { GlazeMachineUsage } from "./glaze-machine-usage.model";

export interface Glaze {
    id: string;
    color: string;
    unitValue: number;
    currentQuantity: number;
    unitCost: number;
    resourceUsages: GlazeResourceUsage[];
    machineUsages: GlazeMachineUsage[];
}
