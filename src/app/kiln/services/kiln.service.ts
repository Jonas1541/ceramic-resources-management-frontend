import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Kiln } from '../models/kiln.model';
import { YearReport } from '../../report/models/year-report.model';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class KilnService {

  private apiUrl = `${environment.apiUrl}/kilns`;

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

  getYearlyReport(kilnId: string): Observable<YearReport[]> {
    return this.http.get<YearReport[]>(`${this.apiUrl}/${kilnId}/yearly-report`);
  }
}
