import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductType } from '../models/product-type.model';

@Injectable({
  providedIn: 'root'
})
export class ProductTypeService {

  private apiUrl = 'http://localhost:8080/product-types'; // TODO: Mover para arquivo de ambiente

  constructor(private http: HttpClient) { }

  getProductTypes(): Observable<ProductType[]> {
    return this.http.get<ProductType[]>(this.apiUrl);
  }

  getProductType(id: string): Observable<ProductType> {
    return this.http.get<ProductType>(`${this.apiUrl}/${id}`);
  }

  createProductType(productType: Partial<ProductType>): Observable<ProductType> {
    return this.http.post<ProductType>(this.apiUrl, productType);
  }

  updateProductType(id: string, productType: Partial<ProductType>): Observable<ProductType> {
    return this.http.put<ProductType>(`${this.apiUrl}/${id}`, productType);
  }

  deleteProductType(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
