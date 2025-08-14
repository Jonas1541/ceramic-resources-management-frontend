import { Machine } from "../../machine/models/machine.model";

export interface FiringMachineUsage {
    id: string;
    usageTime: number;
    machineId: string;
    machineName: string;
}
