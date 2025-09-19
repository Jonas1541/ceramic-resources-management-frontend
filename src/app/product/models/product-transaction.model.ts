import { ProductTransactionEmployeeUsage } from "./product-transaction-employee-usage.model";

export interface ProductTransaction {
    id: string;
    createdAt: string;
    updatedAt: string;
    outgoingAt: string | null;
    state: string;
    outgoingReason: string | null;
    productName: string;
    glazeColor: string;
    glazeQuantity: number;
    employeeUsages: ProductTransactionEmployeeUsage[];
    employeeTotalCost: number;
    cost: number;
    profit: number;
    bisqueFiringId: number | null;
    glazeFiringId: number | null;
}
