import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GlazeFiring } from '../models/glaze-firing.model';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GlazeFiringService {

  private apiUrl = `${environment.apiUrl}/glaze-firings`;

  constructor(private http: HttpClient) { }

  getGlazeFirings(kilnId: string): Observable<GlazeFiring[]> {
    return this.http.get<GlazeFiring[]>(`${environment.apiUrl}/kilns/${kilnId}/glaze-firings`);
  }

  getGlazeFiring(kilnId: string, id: string): Observable<GlazeFiring> {
    return this.http.get<GlazeFiring>(`${environment.apiUrl}/kilns/${kilnId}/glaze-firings/${id}`);
  }

  createGlazeFiring(kilnId: string, glazeFiring: Partial<GlazeFiring>): Observable<GlazeFiring> {
    return this.http.post<GlazeFiring>(`${environment.apiUrl}/kilns/${kilnId}/glaze-firings`, glazeFiring);
  }

  updateGlazeFiring(kilnId: string, id: string, glazeFiring: Partial<GlazeFiring>): Observable<GlazeFiring> {
    return this.http.put<GlazeFiring>(`${environment.apiUrl}/kilns/${kilnId}/glaze-firings/${id}`, glazeFiring);
  }

  deleteGlazeFiring(kilnId: string, id: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/kilns/${kilnId}/glaze-firings/${id}`);
  }
}