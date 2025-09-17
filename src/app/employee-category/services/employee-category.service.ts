import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EmployeeCategory } from '../models/employee-category.model';

@Injectable({
    providedIn: 'root'
})
export class EmployeeCategoryService {

    private apiUrl = `${environment.apiUrl}/employee-categories`;

    constructor(private http: HttpClient) { }

    getEmployeeCategories(): Observable<EmployeeCategory[]> {
        return this.http.get<EmployeeCategory[]>(this.apiUrl);
    }

    getEmployeeCategory(id: string): Observable<EmployeeCategory> {
        return this.http.get<EmployeeCategory>(`${this.apiUrl}/${id}`);
    }

    createEmployeeCategory(employeeCategory: Partial<EmployeeCategory>): Observable<EmployeeCategory> {
        return this.http.post<EmployeeCategory>(this.apiUrl, employeeCategory);
    }

    updateEmployeeCategory(id: string, employeeCategory: Partial<EmployeeCategory>): Observable<EmployeeCategory> {
        return this.http.put<EmployeeCategory>(`${this.apiUrl}/${id}`, employeeCategory);
    }

    deleteEmployeeCategory(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
