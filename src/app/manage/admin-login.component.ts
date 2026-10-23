import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { errorMessage } from '../core/api-error';
import { AuthService } from '../core/auth.service';
import { AdminSession } from '../core/session.service';

// Admin/staff log-in page at /admin/login. It talks to POST /api/auth/admin/login,
// which only accepts Admin and Staff accounts, and it stores the result in the ADMIN session
// (separate from the customer website's session).
@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['../shared/auth-page.css']
})
export class AdminLoginComponent {
  loading = false;
  error = '';

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  constructor(
    private fb: FormBuilder, private auth: AuthService, private router: Router,
    private route: ActivatedRoute, private admin: AdminSession
  ) {
    // Already signed in to the dashboard: no need to see the form
    if (this.admin.isLoggedIn()) this.router.navigateByUrl('/admin/dashboard');
  }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    this.loading = true;
    this.error = '';
    const { email, password } = this.form.getRawValue();

    this.auth.adminLogin(email, password).subscribe({
      next: () => {
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
        const safe = !!returnUrl && returnUrl.startsWith('/admin') && !returnUrl.startsWith('//') && !returnUrl.startsWith('/admin/login');
        this.router.navigateByUrl(safe ? returnUrl! : '/admin/dashboard');
      },
      error: e => { this.error = errorMessage(e, 'Log in failed.'); this.loading = false; }
    });
  }

  invalid(name: 'email' | 'password'): boolean {
    const c = this.form.controls[name];
    return c.touched && c.invalid;
  }
}
