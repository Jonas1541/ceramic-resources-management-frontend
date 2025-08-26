import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GeneralReport } from '../models/general-report.model';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  private apiUrl = 'http://localhost:8080/general-report'; // TODO: Mover para arquivo de ambiente

  constructor(private http: HttpClient) { }

  getGeneralReport(): Observable<GeneralReport[]> {
    return this.http.get<GeneralReport[]>(this.apiUrl);
  }
  
}