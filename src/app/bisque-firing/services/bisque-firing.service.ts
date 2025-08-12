import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BisqueFiring } from '../models/bisque-firing.model';

@Injectable({
  providedIn: 'root'
})
export class BisqueFiringService {

  private apiUrl = 'http://localhost:8080/bisque-firings'; // TODO: Mover para arquivo de ambiente

  constructor(private http: HttpClient) { }

  getBisqueFirings(kilnId: string): Observable<BisqueFiring[]> {
    return this.http.get<BisqueFiring[]>(`http://localhost:8080/kilns/${kilnId}/bisque-firings`);
  }

  getBisqueFiring(kilnId: string, id: string): Observable<BisqueFiring> {
    return this.http.get<BisqueFiring>(`http://localhost:8080/kilns/${kilnId}/bisque-firings/${id}`);
  }

  createBisqueFiring(kilnId: string, bisqueFiring: Partial<BisqueFiring>): Observable<BisqueFiring> {
    return this.http.post<BisqueFiring>(`http://localhost:8080/kilns/${kilnId}/bisque-firings`, bisqueFiring);
  }

  updateBisqueFiring(kilnId: string, id: string, bisqueFiring: Partial<BisqueFiring>): Observable<BisqueFiring> {
    return this.http.put<BisqueFiring>(`http://localhost:8080/kilns/${kilnId}/bisque-firings/${id}`, bisqueFiring);
  }

  deleteBisqueFiring(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}