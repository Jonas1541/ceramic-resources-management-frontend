import { Machine } from "../../machine/models/machine.model";

export interface DryingRoom {
    id: string;
    name: string;
    gasConsumptionPerHour: number;
    machines: Machine[];
    uses: number;
}
