import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { errorMessage } from '../core/api-error';
import { AuthService } from '../core/auth.service';

// Customer log-in page: a full page of its own (no store header or footer), like the big platforms.
// It talks to POST /api/auth/login, which only accepts Customer accounts.
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../shared/auth-page.css']
})
export class LoginComponent {
  loading = false;
  error = '';
  notice = '';

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router, private route: ActivatedRoute) {
    if (this.route.snapshot.queryParamMap.get('registered')) this.notice = 'Account created. Log in to continue.';
  }

  get returnParams(): { returnUrl: string } | null {
    const r = this.route.snapshot.queryParamMap.get('returnUrl');
    return r ? { returnUrl: r } : null;
  }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    this.loading = true;
    this.error = '';
    const { email, password } = this.form.getRawValue();

    this.auth.customerLogin(email, password).subscribe({
      next: () => {
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
        const safe = !!returnUrl && returnUrl.startsWith('/') && !returnUrl.startsWith('//') && !returnUrl.startsWith('/admin');
        this.router.navigateByUrl(safe ? returnUrl! : '/');
      },
      error: e => { this.error = errorMessage(e, 'Log in failed.'); this.loading = false; }
    });
  }

  invalid(name: 'email' | 'password'): boolean {
    const c = this.form.controls[name];
    return c.touched && c.invalid;
  }
}
