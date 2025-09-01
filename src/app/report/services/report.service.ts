import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GeneralReport } from '../models/general-report.model';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  private apiUrl = `${environment.apiUrl}/general-report`;

  constructor(private http: HttpClient) { }

  getGeneralReport(): Observable<GeneralReport[]> {
    return this.http.get<GeneralReport[]>(this.apiUrl);
  }
  
}