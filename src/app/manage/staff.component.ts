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

  // Reset-password popup
  resetTarget: UserRow | null = null;
  resetSaving = false;
  resetError = '';
  resetForm = this.fb.nonNullable.group({
    newPassword: ['', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,100}$/)]],
    confirm: ['', [Validators.required]]
  });

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

  openReset(s: UserRow): void {
    this.resetTarget = s;
    this.resetError = '';
    this.resetForm.reset();
  }

  closeReset(): void { if (!this.resetSaving) this.resetTarget = null; }

  get mismatch(): boolean {
    const v = this.resetForm.getRawValue();
    return !!v.confirm && v.newPassword !== v.confirm;
  }

  submitReset(): void {
    if (!this.resetTarget) return;
    if (this.resetForm.invalid || this.mismatch) { this.resetForm.markAllAsTouched(); return; }

    this.resetSaving = true;
    this.resetError = '';
    const target = this.resetTarget;
    this.users.resetPassword(target.id, this.resetForm.getRawValue().newPassword).subscribe({
      next: () => {
        this.toast.success(`Password reset for ${target.name}. Tell them to sign in with the new password.`);
        this.resetSaving = false; this.resetTarget = null;
      },
      error: e => { this.resetError = errorMessage(e); this.resetSaving = false; }
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
