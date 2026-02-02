import { Machine } from "../../machine/models/machine.model";

export interface Kiln {
    id: string;
    name: string;
    averageBisqueGasConsumption: number;
    averageGlazeGasConsumption: number;
    machines: Machine[];
}
