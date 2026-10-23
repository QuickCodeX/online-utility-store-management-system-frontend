import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { AdminSession } from '../core/session.service';

interface NavItem { label: string; path: string; adminOnly?: boolean; }

@Component({
  selector: 'app-manage-layout',
  templateUrl: './manage-layout.component.html',
  styleUrls: ['./manage-layout.component.css']
})
export class ManageLayoutComponent {
  open = false;

  readonly items: NavItem[] = [
    { label: 'Dashboard', path: 'dashboard' },
    { label: 'Orders', path: 'orders' },
    { label: 'Products', path: 'products' },
    { label: 'Categories', path: 'categories' },
    { label: 'Inventory', path: 'inventory' },
    { label: 'Bills', path: 'bills' },
    { label: 'Customers', path: 'customers' },
    { label: 'Staff', path: 'staff', adminOnly: true },
    { label: 'Sales reports', path: 'reports', adminOnly: true },
    { label: 'Audit log', path: 'audit', adminOnly: true },
    { label: 'My account', path: 'account' }
  ];

  constructor(public session: AdminSession, private auth: AuthService, private router: Router) {}

  get visibleItems(): NavItem[] {
    return this.items.filter(i => !i.adminOnly || this.session.isAdmin());
  }

  logout(): void {
    this.auth.adminLogout();
    this.router.navigate(['/admin/login']);
  }
}
