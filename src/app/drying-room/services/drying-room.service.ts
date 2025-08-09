import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DryingRoom } from '../models/drying-room.model';

import { DryingSession } from '../models/drying-session.model';

@Injectable({
  providedIn: 'root'
})
export class DryingRoomService {

  private apiUrl = 'http://localhost:8080/drying-rooms'; // TODO: Mover para arquivo de ambiente

  constructor(private http: HttpClient) { }

  getDryingRooms(): Observable<DryingRoom[]> {
    return this.http.get<DryingRoom[]>(this.apiUrl);
  }

  getDryingRoom(id: string): Observable<DryingRoom> {
    return this.http.get<DryingRoom>(`${this.apiUrl}/${id}`);
  }

  createDryingRoom(dryingRoom: Partial<DryingRoom>): Observable<DryingRoom> {
    return this.http.post<DryingRoom>(this.apiUrl, dryingRoom);
  }

  updateDryingRoom(id: string, dryingRoom: Partial<DryingRoom>): Observable<DryingRoom> {
    return this.http.put<DryingRoom>(`${this.apiUrl}/${id}`, dryingRoom);
  }

  deleteDryingRoom(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getDryingSessions(dryingRoomId: string): Observable<DryingSession[]> {
    return this.http.get<DryingSession[]>(`${this.apiUrl}/${dryingRoomId}/drying-sessions`);
  }

  createDryingSession(dryingRoomId: string, dryingSession: Partial<DryingSession>): Observable<DryingSession> {
    return this.http.post<DryingSession>(`${this.apiUrl}/${dryingRoomId}/drying-sessions`, dryingSession);
  }

  updateDryingSession(dryingRoomId: string, sessionId: string, dryingSession: Partial<DryingSession>): Observable<DryingSession> {
    return this.http.put<DryingSession>(`${this.apiUrl}/${dryingRoomId}/drying-sessions/${sessionId}`, dryingSession);
  }

  deleteDryingSession(dryingRoomId: string, sessionId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${dryingRoomId}/drying-sessions/${sessionId}`);
  }
}
