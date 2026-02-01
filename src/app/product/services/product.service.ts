import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';
import { ProductTransaction } from '../models/product-transaction.model';
import { YearReport } from '../../report/models/year-report.model';

import { environment } from '../../../environments/environment';

import { HttpParams } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) { }

  // Métodos para Produtos

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  getProduct(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  createProduct(product: Partial<Product>): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product);
  }

  updateProduct(id: string, product: Partial<Product>): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product);
  }

  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Métodos para Transações de Produtos

  getProductTransactions(productId: string, state?: string): Observable<ProductTransaction[]> {
    let params = new HttpParams();
    if (state) {
      params = params.set('state', state);
    }
    return this.http.get<ProductTransaction[]>(`${this.apiUrl}/${productId}/transactions`, { params });
  }

  getProductTransactionById(productId: string, transactionId: string): Observable<ProductTransaction> {
    return this.http.get<ProductTransaction>(`${this.apiUrl}/${productId}/transactions/${transactionId}`);
  }

  createProductTransaction(productId: string, quantity: number, payload: any): Observable<ProductTransaction[]> {
    const params = new HttpParams().set('quantity', quantity.toString());
    return this.http.post<ProductTransaction[]>(`${this.apiUrl}/${productId}/transactions`, payload, { params });
  }

  deleteProductTransaction(productId: string, transactionId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${productId}/transactions/${transactionId}`);
  }

  outgoingProductTransaction(productId: string, transactionId: string, outgoingReason: string): Observable<ProductTransaction> {
    const params = new HttpParams().set('outgoingReason', outgoingReason);
    return this.http.patch<ProductTransaction>(`${this.apiUrl}/${productId}/transactions/${transactionId}`, {}, { params });
  }

  cancelOutgoingProductTransaction(productId: string, transactionId: string): Observable<ProductTransaction> {
    return this.http.patch<ProductTransaction>(`${this.apiUrl}/${productId}/transactions/${transactionId}`, {});
  }

  outgoingByQuantity(productId: string, quantity: number, state: string, outgoingReason: string): Observable<ProductTransaction[]> {
    const params = new HttpParams()
      .set('quantity', quantity.toString())
      .set('state', state)
      .set('outgoingReason', outgoingReason);
    return this.http.patch<ProductTransaction[]>(`${this.apiUrl}/${productId}/transactions/outgoing-by-quantity`, {}, { params });
  }

  cancelOutgoingByQuantity(productId: string, quantity: number, state: string): Observable<ProductTransaction[]> {
    const params = new HttpParams()
      .set('quantity', quantity.toString())
      .set('state', state);
    return this.http.patch<ProductTransaction[]>(`${this.apiUrl}/${productId}/transactions/cancel-outgoing-by-quantity`, {}, { params });
  }

  getYearlyReport(id: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${id}/yearly-report`);
  }
}