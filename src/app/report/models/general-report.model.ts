import { MonthlyReport } from './monthly-report.model';

export interface GeneralReport {
    year: number;
    months: MonthlyReport[];
    totalIncomingCost: number;
    totalOutgoingProfit: number;
}
