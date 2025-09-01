import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Resource, ResourceRequest } from '../models/resource.model';
import { ResourceTransaction, ResourceTransactionRequest } from '../models/resource-transaction.model';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ResourceService {

  private apiUrl = `${environment.apiUrl}/resources`;

  constructor(private http: HttpClient) { }

  // Métodos para Recursos

  getResources(): Observable<Resource[]> {
    return this.http.get<Resource[]>(this.apiUrl);
  }

  getResource(id: string): Observable<Resource> {
    return this.http.get<Resource>(`${this.apiUrl}/${id}`);
  }

  createResource(resource: ResourceRequest): Observable<Resource> {
    return this.http.post<Resource>(this.apiUrl, resource);
  }

  updateResource(id: string, resource: ResourceRequest): Observable<Resource> {
    return this.http.put<Resource>(`${this.apiUrl}/${id}`, resource);
  }

  deleteResource(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Métodos para Transações de Recursos

  getResourceTransactions(resourceId: string): Observable<ResourceTransaction[]> {
    return this.http.get<ResourceTransaction[]>(`${this.apiUrl}/${resourceId}/transactions`);
  }

  createResourceTransaction(resourceId: string, transaction: Partial<ResourceTransaction>): Observable<ResourceTransaction> {
    return this.http.post<ResourceTransaction>(`${this.apiUrl}/${resourceId}/transactions`, transaction);
  }

  updateResourceTransaction(resourceId: string, transactionId: string, transaction: Partial<ResourceTransaction>): Observable<ResourceTransaction> {
    return this.http.put<ResourceTransaction>(`${this.apiUrl}/${resourceId}/transactions/${transactionId}`, transaction);
  }

  deleteResourceTransaction(resourceId: string, transactionId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${resourceId}/transactions/${transactionId}`);
  }

  getYearlyReport(id: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${id}/yearly-report`);
  }
}
