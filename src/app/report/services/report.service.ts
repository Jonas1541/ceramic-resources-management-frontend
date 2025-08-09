import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { YearReport } from '../models/year-report.model';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  private apiUrl = 'http://localhost:8080/reports'; // TODO: Mover para arquivo de ambiente

  constructor(private http: HttpClient) { }

  getYearReport(year: number): Observable<YearReport> {
    return this.http.get<YearReport>(`${this.apiUrl}/year/${year}`);
  }
}
