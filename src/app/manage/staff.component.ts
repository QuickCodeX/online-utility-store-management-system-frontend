import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { errorMessage } from '../core/api-error';
import { UserService } from '../core/api.services';
import { UserRow } from '../core/models';
import { ToastService } from '../core/toast.service';

// Admin only (route guard on the client, [Authorize(Roles = "Admin")] on the API)
@Component({ selector: 'app-staff', templateUrl: './staff.component.html' })
export class StaffComponent implements OnInit {
  staff: UserRow[] = [];
  loading = true;
  saving = false;
  error = '';
  formError = '';

  form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(150)]],
    password: ['', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,100}$/)]]
  });

  constructor(private fb: FormBuilder, private users: UserService, private toast: ToastService) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.users.staff().subscribe({
      next: s => { this.staff = s; this.loading = false; },
      error: e => { this.error = errorMessage(e); this.loading = false; }
    });
  }

  add(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    this.saving = true;
    this.formError = '';
    this.users.createStaff(this.form.getRawValue()).subscribe({
      next: () => { this.toast.success('Staff account created.'); this.form.reset(); this.saving = false; this.load(); },
      error: e => { this.formError = errorMessage(e); this.saving = false; }
    });
  }

  resetPassword(s: UserRow): void {
    const pw = prompt(`New password for ${s.name} (8+ characters, with an uppercase letter, a lowercase letter and a number):`);
    if (!pw) return;
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,100}$/.test(pw)) { this.toast.error('Use 8 or more characters with an uppercase letter, a lowercase letter and a number.'); return; }

    this.users.resetPassword(s.id, pw).subscribe({
      next: () => this.toast.success('Password reset. Tell them to sign in with the new password.'),
      error: e => this.toast.error(errorMessage(e))
    });
  }

  toggle(s: UserRow): void {
    const deactivating = s.isActive;
    if (deactivating && !confirm(`Deactivate ${s.name}? They will be signed out and cannot sign in again. Their past bills stay on record.`)) return;

    this.users.setActive(s.id, !s.isActive).subscribe({
      next: () => { this.toast.success(deactivating ? 'Staff account deactivated.' : 'Staff account activated.'); this.load(); },
      error: e => this.toast.error(errorMessage(e))
    });
  }
}
