import { MonthReport } from "./month-report.model";

export interface YearReport {
    year: number;
    months: MonthReport[];
    totalIncomingQty: number;
    totalIncomingCost: number;
    totalOutgoingQty: number;
    totalOutgoingProfit: number;
}
