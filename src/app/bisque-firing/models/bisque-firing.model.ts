import { Kiln } from "../../kiln/models/kiln.model";
import { FiringMachineUsage } from "./firing-machine-usage.model";

export interface BisqueFiring {
    id: string;
    temperature: number;
    burnTime: number;
    coolingTime: number;
    gasConsumption: number;
    kiln: Kiln;
    machineUsages: FiringMachineUsage[];
    cost: number;
}
