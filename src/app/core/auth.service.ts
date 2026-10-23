import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { LoginResponse, Session } from './models';
import { AdminSession, StoreSession } from './session.service';

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  phone: string | null;
  address: string | null;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient, private store: StoreSession, private admin: AdminSession) {}

  // Customer website sign-in (customer accounts only)
  customerLogin(email: string, password: string): Observable<Session> {
    return this.http.post<LoginResponse>(`${this.api}/login`, { email, password }).pipe(
      map(toSession),
      tap(s => this.store.save(s))
    );
  }

  // Admin dashboard sign-in (admin and staff accounts only)
  adminLogin(email: string, password: string): Observable<Session> {
    return this.http.post<LoginResponse>(`${this.api}/admin/login`, { email, password }).pipe(
      map(toSession),
      tap(s => this.admin.save(s))
    );
  }

  register(body: RegisterRequest): Observable<{ message: string; userId: number }> {
    return this.http.post<{ message: string; userId: number }>(`${this.api}/register`, body);
  }

  // UC-11. The API call is best-effort: even if it fails, the token is still discarded locally.
  // The interceptor attaches the token of the portal the user is currently in.
  customerLogout(): void {
    if (this.store.token) this.http.post(`${this.api}/logout`, {}).subscribe({ error: () => undefined });
    this.store.clear();
  }

  adminLogout(): void {
    if (this.admin.token) this.http.post(`${this.api}/logout`, {}).subscribe({ error: () => undefined });
    this.admin.clear();
  }
}

function toSession(r: LoginResponse): Session {
  return { token: r.token, userId: r.userId, fullName: r.fullName, role: r.role };
}
