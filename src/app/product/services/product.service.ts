import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';
import { ProductTransaction } from '../models/product-transaction.model';
import { YearReport } from '../../report/models/year-report.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = 'http://localhost:8080/products'; // TODO: Mover para arquivo de ambiente

  constructor(private http: HttpClient) { }

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

    getProductTransactionById(productId: string, transactionId: number | string): Observable<ProductTransaction> {
        return this.http.get<ProductTransaction>(`${this.apiUrl}/${productId}/transactions/${transactionId}`);
    }

  getProductTransactions(productId: string, state?: string): Observable<ProductTransaction[]> {
    let url = `${this.apiUrl}/${productId}/transactions`;
    if (state) {
      url += `?state=${state}`;
    }
    return this.http.get<ProductTransaction[]>(url);
  }

  createProductTransaction(productId: string, quantity: number): Observable<ProductTransaction> {
    return this.http.post<ProductTransaction>(`${this.apiUrl}/${productId}/transactions?quantity=${quantity}`, {});
  }

  outgoingProductTransaction(productId: string, transactionId: string, outgoingReason: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${productId}/transactions/${transactionId}?outgoingReason=${outgoingReason}`, {});
  }

  deleteProductTransaction(productId: string, transactionId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${productId}/transactions/${transactionId}`);
  }

  cancelOutgoingProductTransaction(productId: string, transactionId: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${productId}/transactions/${transactionId}`, {});
  }

  getYearlyReport(productId: string): Observable<YearReport[]> {
    return this.http.get<YearReport[]>(`${this.apiUrl}/${productId}/yearly-report`);
  }
}