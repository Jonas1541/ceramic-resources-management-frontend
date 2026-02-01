import { EmployeeCategory } from "../../employee-category/models/employee-category.model";

export interface Employee {
    id: string;
    createdAt: string;
    updatedAt: string;
    name: string;
    categories: EmployeeCategory[];
    costPerHour: number;
}
