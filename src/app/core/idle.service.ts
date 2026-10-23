import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { AdminSession, StoreSession, inAdminArea } from './session.service';
import { ToastService } from './toast.service';

// NFR-009: log the user out after a period of inactivity.
const IDLE_LIMIT_MS = 15 * 60 * 1000;
const EVENTS = ['click', 'keydown', 'mousemove', 'touchstart', 'scroll'];

@Injectable({ providedIn: 'root' })
export class IdleService {
  private timer: ReturnType<typeof setTimeout> | null = null;
  private started = false;

  constructor(
    private zone: NgZone,
    private store: StoreSession,
    private admin: AdminSession,
    private auth: AuthService,
    private router: Router,
    private toast: ToastService
  ) {}

  start(): void {
    if (this.started) return;
    this.started = true;

    // Listen outside Angular's change detection so mouse moves do not trigger re-rendering
    this.zone.runOutsideAngular(() => {
      EVENTS.forEach(e => window.addEventListener(e, () => this.reset(), { passive: true }));
    });
    this.reset();
  }

  private reset(): void {
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(() => this.zone.run(() => this.expire()), IDLE_LIMIT_MS);
  }

  private expire(): void {
    // Only the portal of THIS tab is signed out
    const adminArea = inAdminArea();
    if (!(adminArea ? this.admin.session : this.store.session)) return;   // nobody is signed in
    if (adminArea) this.auth.adminLogout(); else this.auth.customerLogout();
    this.toast.error('You were signed out after 15 minutes of inactivity.');
    this.router.navigate([adminArea ? '/admin/login' : '/account/login']);
  }
}
