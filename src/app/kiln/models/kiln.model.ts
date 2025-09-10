import { Machine } from "../../machine/models/machine.model";

export interface Kiln {
    id: string;
    name: string;
    gasConsumptionPerHour: number;
    machines: Machine[];
}
