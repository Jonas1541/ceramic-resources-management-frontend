import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = `${environment.apiUrl}`;
  private _isLoggedIn$ = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this._isLoggedIn$.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    const token = sessionStorage.getItem('token');
    this._isLoggedIn$.next(!!token);
  }

  register(company: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/companies`, company);
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, credentials).pipe(
      tap((response: any) => {
        sessionStorage.setItem('token', response.token);
        this._isLoggedIn$.next(true);
      })
    );
  }

  logout(): void {
    sessionStorage.removeItem('token');
    this._isLoggedIn$.next(false);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return sessionStorage.getItem('token');
  }

  scheduleOwnAccountDeletion(): Observable<any> {
    return this.http.patch(`${this.apiUrl}/companies/me/schedule-deletion`, {});
  }

  cancelOwnAccountDeletion(): Observable<any> {
    return this.http.patch(`${this.apiUrl}/companies/me/cancel-deletion`, {});
  }

  getOwnDeletionStatus(): Observable<any> {
    return this.http.get(`${this.apiUrl}/companies/me/deletion-status`);
  }

  forgotPassword(data: { email: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/forgot-password`, data);
  }

  resetPassword(data: { token: string, password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/reset-password`, data);
  }
}
