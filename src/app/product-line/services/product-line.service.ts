import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductLine } from '../models/product-line.model';

@Injectable({
  providedIn: 'root'
})
export class ProductLineService {

  private apiUrl = 'http://localhost:8080/product-lines'; // TODO: Mover para arquivo de ambiente

  constructor(private http: HttpClient) { }

  getProductLines(): Observable<ProductLine[]> {
    return this.http.get<ProductLine[]>(this.apiUrl);
  }

  getProductLine(id: string): Observable<ProductLine> {
    return this.http.get<ProductLine>(`${this.apiUrl}/${id}`);
  }

  createProductLine(productLine: Partial<ProductLine>): Observable<ProductLine> {
    return this.http.post<ProductLine>(this.apiUrl, productLine);
  }

  updateProductLine(id: string, productLine: Partial<ProductLine>): Observable<ProductLine> {
    return this.http.put<ProductLine>(`${this.apiUrl}/${id}`, productLine);
  }

  deleteProductLine(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
