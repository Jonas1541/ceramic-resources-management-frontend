import { Kiln } from "../../kiln/models/kiln.model";
import { FiringMachineUsage } from "../../bisque-firing/models/firing-machine-usage.model";

export interface Glost {
    productId: string;
    productTxId: string;
    glazeId: string;
    productName: string;
    glazeColor: string;
    quantity: number;
}

export interface GlazeFiring {
    id: string;
    createdAt: string;
    updatedAt: string;
    temperature: number;
    burnTime: number;
    coolingTime: number;
    gasConsumption: number;
    kilnName: string;
    glosts: Glost[];
    machineUsages: FiringMachineUsage[];
    cost: number;
}