import { ProductTransactionEmployeeUsage } from "./product-transaction-employee-usage.model";

export interface ProductTransaction {
    id: string;
    unitName: string,
    productId: string;
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
    batchCost: number;
    bisqueFiringCost: number;
    glazeFiringCost: number;
    glazeTransactionCost: number;
    totalCost: number;
    profit: number;
    bisqueFiringId: number | null;
    glazeFiringId: number | null;
}
