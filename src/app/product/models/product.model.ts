import { EmployeeUsage } from "./employee-usage.model";

export interface Product {
    id: string;
    name: string;
    price: number;
    height: number;
    length: number;
    width: number;
    weight: number;
    glazeQuantityPerUnit: number;
    type: string;
    line: string;
    productStock: number;
    employeeUsages: EmployeeUsage[];
}