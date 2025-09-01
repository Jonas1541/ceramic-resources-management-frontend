import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductType } from '../models/product-type.model';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductTypeService {

  private apiUrl = `${environment.apiUrl}/product-types`;

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
