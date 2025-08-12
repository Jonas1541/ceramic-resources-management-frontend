import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GlazeFiring } from '../models/glaze-firing.model';

@Injectable({
  providedIn: 'root'
})
export class GlazeFiringService {

  private apiUrl = 'http://localhost:8080/glaze-firings'; // TODO: Mover para arquivo de ambiente

  constructor(private http: HttpClient) { }

  getGlazeFirings(kilnId: string): Observable<GlazeFiring[]> {
    return this.http.get<GlazeFiring[]>(`http://localhost:8080/kilns/${kilnId}/glaze-firings`);
  }

  getGlazeFiring(kilnId: string, id: string): Observable<GlazeFiring> {
    return this.http.get<GlazeFiring>(`http://localhost:8080/kilns/${kilnId}/glaze-firings/${id}`);
  }

  createGlazeFiring(kilnId: string, glazeFiring: Partial<GlazeFiring>): Observable<GlazeFiring> {
    return this.http.post<GlazeFiring>(`http://localhost:8080/kilns/${kilnId}/glaze-firings`, glazeFiring);
  }

  updateGlazeFiring(kilnId: string, id: string, glazeFiring: Partial<GlazeFiring>): Observable<GlazeFiring> {
    return this.http.put<GlazeFiring>(`http://localhost:8080/kilns/${kilnId}/glaze-firings/${id}`, glazeFiring);
  }

  deleteGlazeFiring(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}