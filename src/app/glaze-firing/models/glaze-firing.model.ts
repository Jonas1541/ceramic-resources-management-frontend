import { Kiln } from "../../kiln/models/kiln.model";
import { GlazeFiringEmployeeUsage } from "./glaze-firing-employee-usage.model";

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
    temperature: number;
    burnTime: number;
    coolingTime: number;
    glosts: any[];
    employeeUsages: GlazeFiringEmployeeUsage[];
    gasConsumption: number;
    cost: number;
    createdAt: Date;
    updatedAt: Date;
}