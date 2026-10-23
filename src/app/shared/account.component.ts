import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { errorMessage } from '../core/api-error';
import { AccountService } from '../core/api.services';
import { Profile } from '../core/models';
import { ToastService } from '../core/toast.service';
import { AuthService } from '../core/auth.service';
import { AdminSession, StoreSession, inAdminArea } from '../core/session.service';
import { Router } from '@angular/router';

// "My account" for every role: edit name/phone/address and change password
@Component({
  selector: 'app-account',
  templateUrl: './account.component.html'
})
export class AccountComponent implements OnInit {
  profile: Profile | null = null;
  loading = true;
  loadError = '';
  savingProfile = false;
  savingPassword = false;
  profileError = '';
  passwordError = '';

  profileForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    phone: ['', [Validators.maxLength(20)]],
    address: ['', [Validators.maxLength(250)]]
  });

  passwordForm = this.fb.nonNullable.group({
    currentPassword: ['', [Validators.required]],
    newPassword: ['', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,100}$/)]]
  });

  constructor(
    private fb: FormBuilder, private accounts: AccountService, private toast: ToastService,
    private store: StoreSession, private admin: AdminSession, private router: Router, private auth: AuthService
  ) {}

  // The customer website has no sign-out button on phones except here; the admin shell has its own
  get isStore(): boolean { return !inAdminArea(); }

  logout(): void {
    this.auth.customerLogout();
    this.router.navigate(['/']);
  }

  ngOnInit(): void {
    this.accounts.me().subscribe({
      next: p => {
        this.profile = p;
        this.profileForm.patchValue({ name: p.name, phone: p.phone ?? '', address: p.address ?? '' });
        this.loading = false;
      },
      error: e => { this.loadError = errorMessage(e); this.loading = false; }
    });
  }

  saveProfile(): void {
    if (this.profileForm.invalid) { this.profileForm.markAllAsTouched(); return; }
    this.savingProfile = true;
    this.profileError = '';
    const v = this.profileForm.getRawValue();

    this.accounts.update({ name: v.name, phone: v.phone || null, address: v.address || null }).subscribe({
      next: p => { this.profile = p; this.savingProfile = false; this.toast.success('Your details were saved.'); },
      error: e => { this.profileError = errorMessage(e); this.savingProfile = false; }
    });
  }

  savePassword(): void {
    if (this.passwordForm.invalid) { this.passwordForm.markAllAsTouched(); return; }
    this.savingPassword = true;
    this.passwordError = '';
    const v = this.passwordForm.getRawValue();

    this.accounts.changePassword(v.currentPassword, v.newPassword).subscribe({
      next: () => {
        this.savingPassword = false;
        this.passwordForm.reset();
        // The server just revoked every old token (including this one), so sign in again with the new password
        const adminArea = inAdminArea();
        (adminArea ? this.admin : this.store).clear();
        this.toast.success('Your password was changed. Please sign in again.');
        this.router.navigate([adminArea ? '/admin/login' : '/account/login']);
      },
      error: e => { this.passwordError = errorMessage(e); this.savingPassword = false; }
    });
  }
}
