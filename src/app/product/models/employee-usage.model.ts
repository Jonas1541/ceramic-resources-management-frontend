export interface EmployeeUsage {
    employeeId: string;
    employeeName: string;
    usageTime: number;
    employeeCost?: number; // Optional because request might not have it, or we rely on backend
}
