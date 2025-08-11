import { Kiln } from "../../kiln/models/kiln.model";
import { FiringMachineUsage } from "../../bisque-firing/models/firing-machine-usage.model";

export interface GlazeFiring {
    id: string;
    temperature: number;
    burnTime: number;
    coolingTime: number;
    gasConsumption: number;
    kiln: Kiln;
    machineUsages: FiringMachineUsage[];
    cost: number;
}
