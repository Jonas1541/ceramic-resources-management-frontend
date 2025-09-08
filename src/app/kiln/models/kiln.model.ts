import { Machine } from "../../machine/models/machine.model";

export interface Kiln {
    id: string;
    name: string;
    machines: Machine[];
}
