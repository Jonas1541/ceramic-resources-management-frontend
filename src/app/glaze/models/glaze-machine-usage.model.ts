import { Machine } from "../../machine/models/machine.model";

export interface GlazeMachineUsage {
    id: string;
    usageTime: number;
    machine: Machine;
}
