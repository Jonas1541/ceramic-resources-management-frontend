import { Kiln } from "../../kiln/models/kiln.model";
import { FiringMachineUsage } from "./firing-machine-usage.model";
import { ProductTransaction } from "../../product/models/product-transaction.model";

export interface BisqueFiring {
    id: string;
    createdAt: string;
    updatedAt: string;
    temperature: number;
    burnTime: number;
    coolingTime: number;
    gasConsumption: number;
    kilnName: string;
    biscuits: ProductTransaction[]; // Assumindo que são ProductTransactions
    machineUsages: FiringMachineUsage[];
    cost: number;
}
