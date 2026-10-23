import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Role } from './models';
import { AdminSession, StoreSession } from './session.service';

// Customer website: must be signed in as a customer. Otherwise go to the full-page customer login.
export const customerGuard: CanActivateFn = (_route, state) => {
  const store = inject(StoreSession);
  const router = inject(Router);

  if (store.isLoggedIn() && store.isCustomer()) return true;
  return router.createUrlTree(['/account/login'], { queryParams: { returnUrl: state.url } });
};

// Admin dashboard: must be signed in as Admin/Staff, with one of the roles in the route's data: { roles: [...] }.
// This only improves the experience; the API enforces the same rules on every request.
export const adminGuard: CanActivateFn = (route, state) => {
  const admin = inject(AdminSession);
  const router = inject(Router);

  if (!admin.isLoggedIn()) {
    return router.createUrlTree(['/admin/login'], { queryParams: { returnUrl: state.url } });
  }

  const allowed = (route.data['roles'] ?? ['Admin', 'Staff']) as Role[];
  if (admin.role && allowed.includes(admin.role)) return true;

  return router.createUrlTree(['/admin/dashboard']);
};
