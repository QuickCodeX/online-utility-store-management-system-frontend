import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Role, Session } from './models';

// A "portal" is one of the two doors into the system:
//   - the customer website  (/, /shop, /account/login ...)  -> StoreSession
//   - the admin dashboard   (/admin/...)                    -> AdminSession
// Each portal keeps its OWN login in its OWN storage slot, so a customer and an admin can be
// signed in at the same time in two tabs of one browser, exactly like a Shopify shop and its admin area.
// (The old code used one shared slot, so the last login overwrote the other one.)
//
// This class does NOT use HttpClient, so the HTTP interceptor can depend on it without a circular dependency.
export abstract class PortalSession {
  private readonly subject: BehaviorSubject<Session | null>;
  readonly session$;

  protected constructor(private readonly storageKey: string) {
    this.subject = new BehaviorSubject<Session | null>(this.read());
    this.session$ = this.subject.asObservable();

    // If this portal signs in or out in ANOTHER tab, this tab follows (the 'storage' event only fires in the other tabs).
    window.addEventListener('storage', e => {
      if (e.key === this.storageKey) this.subject.next(this.read());
    });
  }

  get session(): Session | null { return this.subject.value; }
  get token(): string | null { return this.session?.token ?? null; }
  get role(): Role | null { return this.session?.role ?? null; }
  get fullName(): string { return this.session?.fullName ?? ''; }

  isLoggedIn(): boolean {
    const s = this.session;
    if (!s) return false;
    if (this.isExpired(s.token)) {
      this.clear();
      return false;
    }
    return true;
  }

  isStaffOrAdmin(): boolean { return this.role === 'Admin' || this.role === 'Staff'; }
  isAdmin(): boolean { return this.role === 'Admin'; }
  isCustomer(): boolean { return this.role === 'Customer'; }

  save(session: Session): void {
    try { localStorage.setItem(this.storageKey, JSON.stringify(session)); } catch { /* private mode: keep in memory only */ }
    this.subject.next(session);
  }

  clear(): void {
    try { localStorage.removeItem(this.storageKey); } catch { /* ignore */ }
    this.subject.next(null);
  }

  private read(): Session | null {
    try {
      const raw = localStorage.getItem(this.storageKey);
      return raw ? (JSON.parse(raw) as Session) : null;
    } catch {
      return null;
    }
  }

  // The token's expiry is stored inside it (the "exp" claim)
  private isExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
      return typeof payload.exp === 'number' && payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }
}

// Customer website session. Only Customer accounts can ever be stored here.
@Injectable({ providedIn: 'root' })
export class StoreSession extends PortalSession {
  constructor() { super('utility_store_session'); }
}

// Admin dashboard session. Only Admin and Staff accounts can ever be stored here.
@Injectable({ providedIn: 'root' })
export class AdminSession extends PortalSession {
  constructor() { super('utility_admin_session'); }
}

// True when the browser is currently on an admin-dashboard URL
export function inAdminArea(): boolean {
  const p = window.location.pathname;
  return p === '/admin' || p.startsWith('/admin/');
}
