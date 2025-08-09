import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Kiln } from '../models/kiln.model';

@Injectable({
  providedIn: 'root'
})
export class KilnService {

  private apiUrl = 'http://localhost:8080/kilns'; // TODO: Mover para arquivo de ambiente

  constructor(private http: HttpClient) { }

  getKilns(): Observable<Kiln[]> {
    return this.http.get<Kiln[]>(this.apiUrl);
  }

  getKiln(id: string): Observable<Kiln> {
    return this.http.get<Kiln>(`${this.apiUrl}/${id}`);
  }

  createKiln(kiln: Partial<Kiln>): Observable<Kiln> {
    return this.http.post<Kiln>(this.apiUrl, kiln);
  }

  updateKiln(id: string, kiln: Partial<Kiln>): Observable<Kiln> {
    return this.http.put<Kiln>(`${this.apiUrl}/${id}`, kiln);
  }

  deleteKiln(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
