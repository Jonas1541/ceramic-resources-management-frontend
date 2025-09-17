import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Employee } from '../models/employee.model';

@Injectable({
    providedIn: 'root'
})
export class EmployeeService {

    private apiUrl = `${environment.apiUrl}/employees`;

    constructor(private http: HttpClient) { }

    getEmployees(): Observable<Employee[]> {
        return this.http.get<Employee[]>(this.apiUrl);
    }

    getEmployee(id: string): Observable<Employee> {
        return this.http.get<Employee>(`${this.apiUrl}/${id}`);
    }

    createEmployee(Employee: Partial<Employee>): Observable<Employee> {
        return this.http.post<Employee>(this.apiUrl, Employee);
    }

    updateEmployee(id: string, Employee: Partial<Employee>): Observable<Employee> {
        return this.http.put<Employee>(`${this.apiUrl}/${id}`, Employee);
    }

    deleteEmployee(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
