import { Kiln } from "../../kiln/models/kiln.model";
import { ProductTransaction } from "../../product/models/product-transaction.model";
import { BisqueFiringEmployeeUsage } from "./bisque-firing-employee-usage.model";

export interface BisqueFiring {
    id: string;
    temperature: number;
    burnTime: number;
    coolingTime: number;
    biscuits: any[];
    employeeUsages: BisqueFiringEmployeeUsage[];
    gasConsumption: number;
    cost: number;
    createdAt: Date;
    updatedAt: Date;
}
