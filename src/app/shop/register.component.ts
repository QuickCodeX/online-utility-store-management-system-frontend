import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { errorMessage } from '../core/api-error';
import { AuthService } from '../core/auth.service';

function passwordsMatch(group: AbstractControl): ValidationErrors | null {
  return group.get('password')?.value === group.get('confirm')?.value ? null : { mismatch: true };
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['../shared/auth-page.css']
})
export class RegisterComponent {
  loading = false;
  error = '';

  form = this.fb.nonNullable.group({
    fullName: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(150)]],
    phone: ['', [Validators.maxLength(20)]],
    address: ['', [Validators.maxLength(250)]],
    password: ['', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,100}$/)]],
    confirm: ['', [Validators.required]]
  }, { validators: passwordsMatch });

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router, private route: ActivatedRoute) {}

  get returnParams(): { returnUrl: string } | null {
    const r = this.route.snapshot.queryParamMap.get('returnUrl');
    return r ? { returnUrl: r } : null;
  }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    this.loading = true;
    this.error = '';
    const v = this.form.getRawValue();

    // No role is sent. The server always creates a Customer.
    this.auth.register({
      fullName: v.fullName,
      email: v.email,
      password: v.password,
      phone: v.phone || null,
      address: v.address || null
    }).subscribe({
      next: () => {
        this.router.navigate(['/account/login'], { queryParams: { registered: 1, ...this.returnParams } });
      },
      error: e => { this.error = errorMessage(e, 'Registration failed.'); this.loading = false; }
    });
  }

  invalid(name: 'fullName' | 'email' | 'password' | 'confirm'): boolean {
    const c = this.form.controls[name];
    return c.touched && c.invalid;
  }
}
