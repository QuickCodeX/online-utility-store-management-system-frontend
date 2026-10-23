import { Component, OnInit } from '@angular/core';
import { errorMessage } from '../core/api-error';
import { UserService } from '../core/api.services';
import { UserRow } from '../core/models';
import { AdminSession } from '../core/session.service';
import { ToastService } from '../core/toast.service';

@Component({ selector: 'app-customers', templateUrl: './customers.component.html' })
export class CustomersComponent implements OnInit {
  customers: UserRow[] = [];
  filter = '';
  loading = true;
  error = '';

  constructor(private users: UserService, public session: AdminSession, private toast: ToastService) {}

  ngOnInit(): void { this.load(); }

  get shown(): UserRow[] {
    const f = this.filter.trim().toLowerCase();
    return f ? this.customers.filter(c => c.name.toLowerCase().includes(f) || c.email.toLowerCase().includes(f)) : this.customers;
  }

  load(): void {
    this.users.customers().subscribe({
      next: c => { this.customers = c; this.loading = false; },
      error: e => { this.error = errorMessage(e); this.loading = false; }
    });
  }

  toggle(c: UserRow): void {
    const deactivating = c.isActive;
    if (deactivating && !confirm(`Deactivate ${c.name}? They will not be able to sign in or order.`)) return;

    this.users.setActive(c.id, !c.isActive).subscribe({
      next: () => { this.toast.success(deactivating ? 'Account deactivated.' : 'Account activated.'); this.load(); },
      error: e => this.toast.error(errorMessage(e))
    });
  }
}
