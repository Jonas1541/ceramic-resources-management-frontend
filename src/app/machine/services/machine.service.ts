import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Machine } from '../models/machine.model';

@Injectable({
  providedIn: 'root'
})
export class MachineService {

  private apiUrl = 'http://localhost:8080/machines'; // TODO: Mover para arquivo de ambiente

  constructor(private http: HttpClient) { }

  getMachines(): Observable<Machine[]> {
    return this.http.get<Machine[]>(this.apiUrl);
  }

  getMachine(id: string): Observable<Machine> {
    return this.http.get<Machine>(`${this.apiUrl}/${id}`);
  }

  createMachine(machine: Partial<Machine>): Observable<Machine> {
    return this.http.post<Machine>(this.apiUrl, machine);
  }

  updateMachine(id: string, machine: Partial<Machine>): Observable<Machine> {
    return this.http.put<Machine>(`${this.apiUrl}/${id}`, machine);
  }

  deleteMachine(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
