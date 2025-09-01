import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BisqueFiring } from '../models/bisque-firing.model';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BisqueFiringService {

  private apiUrl = `${environment.apiUrl}/bisque-firings`;

  constructor(private http: HttpClient) { }

  getBisqueFirings(kilnId: string): Observable<BisqueFiring[]> {
    return this.http.get<BisqueFiring[]>(`${environment.apiUrl}/kilns/${kilnId}/bisque-firings`);
  }

  getBisqueFiring(kilnId: string, id: string): Observable<BisqueFiring> {
    return this.http.get<BisqueFiring>(`${environment.apiUrl}/kilns/${kilnId}/bisque-firings/${id}`);
  }

  createBisqueFiring(kilnId: string, bisqueFiring: Partial<BisqueFiring>): Observable<BisqueFiring> {
    return this.http.post<BisqueFiring>(`${environment.apiUrl}/kilns/${kilnId}/bisque-firings`, bisqueFiring);
  }

  updateBisqueFiring(kilnId: string, id: string, bisqueFiring: Partial<BisqueFiring>): Observable<BisqueFiring> {
    return this.http.put<BisqueFiring>(`${environment.apiUrl}/kilns/${kilnId}/bisque-firings/${id}`, bisqueFiring);
  }

  deleteBisqueFiring(kilnId: string, id: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/kilns/${kilnId}/bisque-firings/${id}`);
  }
}