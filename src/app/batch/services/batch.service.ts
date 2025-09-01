import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Batch } from '../models/batch.model';
import { BatchList } from '../models/batch-list.model';
import { BatchTransaction } from '../models/batch-transaction.model';
import { YearReport } from '../../report/models/year-report.model';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BatchService {

  private apiUrl = `${environment.apiUrl}/batches`;

  constructor(private http: HttpClient) { }

  // Métodos para Batches

  getBatches(): Observable<BatchList[]> {
    return this.http.get<BatchList[]>(this.apiUrl);
  }

  getBatch(id: string): Observable<Batch> {
    return this.http.get<Batch>(`${this.apiUrl}/${id}`);
  }

  createBatch(batch: Partial<Batch>): Observable<Batch> {
    return this.http.post<Batch>(this.apiUrl, batch);
  }

  updateBatch(id: string, batch: Partial<Batch>): Observable<Batch> {
    return this.http.put<Batch>(`${this.apiUrl}/${id}`, batch);
  }

  deleteBatch(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getYearlyReport(): Observable<YearReport[]> {
    return this.http.get<YearReport[]>(`${this.apiUrl}/yearly-report`);
  }
}
