import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { adminGuard } from '../core/guards';
import { AccountComponent } from '../shared/account.component';
import { SharedModule } from '../shared/shared.module';
import { AdminLoginComponent } from './admin-login.component';
import { AuditComponent } from './audit.component';
import { BillDetailComponent } from './bill-detail.component';
import { BillsComponent } from './bills.component';
import { CategoriesComponent } from './categories.component';
import { CustomersComponent } from './customers.component';
import { DashboardComponent } from './dashboard.component';
import { InventoryComponent } from './inventory.component';
import { ManageLayoutComponent } from './manage-layout.component';
import { OrderDetailComponent } from './order-detail.component';
import { OrdersComponent } from './orders.component';
import { ProductFormComponent } from './product-form.component';
import { ProductsComponent } from './products.component';
import { ReportsComponent } from './reports.component';
import { StaffComponent } from './staff.component';

const adminOnly = { canActivate: [adminGuard], data: { roles: ['Admin'] } };

const routes: Routes = [
  // Separate door for staff and administrators (full page, no dashboard shell)
  { path: 'login', component: AdminLoginComponent, title: 'Log in · UtilityStore Admin' },
  {
    path: '',
    component: ManageLayoutComponent,
    canActivate: [adminGuard],
    data: { roles: ['Admin', 'Staff'] },
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      { path: 'dashboard', component: DashboardComponent, title: 'Dashboard · UtilityStore' },
      { path: 'orders', component: OrdersComponent, title: 'Orders · UtilityStore' },
      { path: 'orders/:id', component: OrderDetailComponent, title: 'Order · UtilityStore' },
      { path: 'products', component: ProductsComponent, title: 'Products · UtilityStore' },
      { path: 'products/new', component: ProductFormComponent, title: 'Add product · UtilityStore' },
      { path: 'products/:id/edit', component: ProductFormComponent, title: 'Edit product · UtilityStore' },
      { path: 'categories', component: CategoriesComponent, title: 'Categories · UtilityStore' },
      { path: 'inventory', component: InventoryComponent, title: 'Inventory · UtilityStore' },
      { path: 'bills', component: BillsComponent, title: 'Bills · UtilityStore' },
      { path: 'bills/:id', component: BillDetailComponent, title: 'Bill · UtilityStore' },
      { path: 'customers', component: CustomersComponent, title: 'Customers · UtilityStore' },
      { path: 'staff', component: StaffComponent, title: 'Staff · UtilityStore', ...adminOnly },
      { path: 'reports', component: ReportsComponent, title: 'Sales reports · UtilityStore', ...adminOnly },
      { path: 'audit', component: AuditComponent, title: 'Audit log · UtilityStore', ...adminOnly },
      { path: 'account', component: AccountComponent, title: 'My account · UtilityStore' },
      { path: '**', redirectTo: 'dashboard' }
    ]
  }
];

@NgModule({
  declarations: [
    AdminLoginComponent, ManageLayoutComponent, DashboardComponent, ProductsComponent, ProductFormComponent, CategoriesComponent,
    InventoryComponent, OrdersComponent, OrderDetailComponent, BillsComponent, BillDetailComponent,
    CustomersComponent, StaffComponent, ReportsComponent, AuditComponent
  ],
  imports: [SharedModule, RouterModule.forChild(routes)]
})
export class ManageModule {}
