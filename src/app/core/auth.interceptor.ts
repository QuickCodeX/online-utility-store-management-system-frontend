import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { AdminSession, StoreSession, inAdminArea } from './session.service';
import { ToastService } from './toast.service';

// 1. Adds "Authorization: Bearer <token>" to every API request, using the token of the portal
//    the page belongs to (admin dashboard pages use the admin login, everything else the customer login).
// 2. If the API answers 401 (token expired / account deactivated) only THAT portal is signed out.
// 3. If the API answers 403 the user is told they lack permission.
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private store: StoreSession,
    private admin: AdminSession,
    private router: Router,
    private toast: ToastService
  ) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const isApiCall = req.url.startsWith(environment.apiUrl);
    const adminArea = inAdminArea();
    const portal = adminArea ? this.admin : this.store;
    const token = portal.token;

    const request = token && isApiCall
      ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
      : req;

    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {
        const isLoginCall = req.url.includes('/login');

        if (isApiCall && err.status === 401 && !isLoginCall) {
          portal.clear();
          this.toast.error('Your session has ended. Please sign in again.');
          this.router.navigate([adminArea ? '/admin/login' : '/account/login'], { queryParams: { returnUrl: this.router.url } });
        } else if (isApiCall && err.status === 403) {
          this.toast.error('You do not have permission to do that.');
        }

        return throwError(() => err);
      })
    );
  }
}
