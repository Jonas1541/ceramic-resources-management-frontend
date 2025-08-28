import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Glaze } from '../models/glaze.model';
import { GlazeTransaction } from '../models/glaze-transaction.model';

@Injectable({
  providedIn: 'root'
})
export class GlazeService {

  private apiUrl = 'http://localhost:8080/glazes'; // TODO: Mover para arquivo de ambiente

  constructor(private http: HttpClient) { }

  // Métodos para Glazes

  getGlazes(): Observable<Glaze[]> {
    return this.http.get<Glaze[]>(this.apiUrl);
  }

  getGlaze(id: string): Observable<Glaze> {
    return this.http.get<Glaze>(`${this.apiUrl}/${id}`);
  }

  createGlaze(glaze: Partial<Glaze>): Observable<Glaze> {
    return this.http.post<Glaze>(this.apiUrl, glaze);
  }

  updateGlaze(id: string, glaze: Partial<Glaze>): Observable<Glaze> {
    return this.http.put<Glaze>(`${this.apiUrl}/${id}`, glaze);
  }

  deleteGlaze(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Métodos para Transações de Glazes

  getGlazeTransactions(glazeId: string): Observable<GlazeTransaction[]> {
    return this.http.get<GlazeTransaction[]>(`${this.apiUrl}/${glazeId}/transactions`);
  }

  createGlazeTransaction(glazeId: string, transaction: Partial<GlazeTransaction>): Observable<GlazeTransaction> {
    return this.http.post<GlazeTransaction>(`${this.apiUrl}/${glazeId}/transactions`, transaction);
  }

  updateGlazeTransaction(glazeId: string, transactionId: string, transaction: Partial<GlazeTransaction>): Observable<GlazeTransaction> {
    return this.http.put<GlazeTransaction>(`${this.apiUrl}/${glazeId}/transactions/${transactionId}`, transaction);
  }

  deleteGlazeTransaction(glazeId: string, transactionId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${glazeId}/transactions/${transactionId}`);
  }

  getYearlyReport(glazeId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${glazeId}/yearly-report`);
  }
}
