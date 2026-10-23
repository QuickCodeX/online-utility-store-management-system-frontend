import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  BillDetail, BillSummary, Category, CategorySave, CheckoutRequest, DashboardData, InventoryRow,
  AuditPage, OrderDetail, OrderPlaced, OrderSummary, Product, ProductSave, Profile, SalesReport, UserRow
} from './models';

const API = environment.apiUrl;

@Injectable({ providedIn: 'root' })
export class ProductService {
  constructor(private http: HttpClient) {}

  // Storefront (public)
  search(filter: { categoryId?: number | null; keyword?: string | null; sort?: string | null }): Observable<Product[]> {
    let params = new HttpParams();
    if (filter.categoryId) params = params.set('categoryId', filter.categoryId);
    if (filter.keyword) params = params.set('keyword', filter.keyword);
    if (filter.sort) params = params.set('sort', filter.sort);
    return this.http.get<Product[]>(`${API}/products/search`, { params });
  }

  getById(id: number): Observable<Product> {
    return this.http.get<Product>(`${API}/products/${id}`);
  }

  // Management panel
  manageList(): Observable<Product[]> {
    return this.http.get<Product[]>(`${API}/products/manage`);
  }

  create(dto: ProductSave): Observable<{ id: number; name: string }> {
    return this.http.post<{ id: number; name: string }>(`${API}/products`, dto);
  }

  update(id: number, dto: ProductSave): Observable<{ id: number; name: string }> {
    return this.http.put<{ id: number; name: string }>(`${API}/products/${id}`, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${API}/products/${id}`);
  }
}

@Injectable({ providedIn: 'root' })
export class CategoryService {
  constructor(private http: HttpClient) {}

  list(): Observable<Category[]> {
    return this.http.get<Category[]>(`${API}/categories`);
  }

  manageList(): Observable<Category[]> {
    return this.http.get<Category[]>(`${API}/categories/manage`);
  }

  create(dto: CategorySave): Observable<Category> {
    return this.http.post<Category>(`${API}/categories`, dto);
  }

  update(id: number, dto: CategorySave): Observable<Category> {
    return this.http.put<Category>(`${API}/categories/${id}`, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${API}/categories/${id}`);
  }
}

@Injectable({ providedIn: 'root' })
export class InventoryService {
  constructor(private http: HttpClient) {}

  list(): Observable<InventoryRow[]> {
    return this.http.get<InventoryRow[]>(`${API}/inventory`);
  }

  setStock(productId: number, quantityStock: number): Observable<{ productId: number; quantityStock: number }> {
    return this.http.put<{ productId: number; quantityStock: number }>(`${API}/inventory/${productId}`, { quantityStock });
  }

  receive(productId: number, quantity: number): Observable<{ productId: number; quantityStock: number }> {
    return this.http.post<{ productId: number; quantityStock: number }>(`${API}/inventory/${productId}/receive`, { quantity });
  }
}

@Injectable({ providedIn: 'root' })
export class OrderService {
  constructor(private http: HttpClient) {}

  place(request: CheckoutRequest): Observable<OrderPlaced> {
    return this.http.post<OrderPlaced>(`${API}/orders`, request);
  }

  mine(): Observable<OrderSummary[]> {
    return this.http.get<OrderSummary[]>(`${API}/orders/mine`);
  }

  all(status?: string, search?: string): Observable<OrderSummary[]> {
    let params = new HttpParams();
    if (status) params = params.set('status', status);
    if (search) params = params.set('search', search);
    return this.http.get<OrderSummary[]>(`${API}/orders`, { params });
  }

  get(id: number): Observable<OrderDetail> {
    return this.http.get<OrderDetail>(`${API}/orders/${id}`);
  }

  cancelMine(id: number): Observable<{ id: number; status: string }> {
    return this.http.put<{ id: number; status: string }>(`${API}/orders/${id}/cancel`, {});
  }

  updateStatus(id: number, status: string): Observable<{ id: number; status: string; paymentStatus: string }> {
    return this.http.put<{ id: number; status: string; paymentStatus: string }>(`${API}/orders/${id}/status`, { status });
  }
}

@Injectable({ providedIn: 'root' })
export class BillService {
  constructor(private http: HttpClient) {}

  create(orderId: number): Observable<{ billId: number }> {
    return this.http.post<{ billId: number }>(`${API}/bills`, { orderId });
  }

  list(): Observable<BillSummary[]> {
    return this.http.get<BillSummary[]>(`${API}/bills`);
  }

  get(id: number): Observable<BillDetail> {
    return this.http.get<BillDetail>(`${API}/bills/${id}`);
  }
}

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient) {}

  customers(): Observable<UserRow[]> {
    return this.http.get<UserRow[]>(`${API}/users/customers`);
  }

  staff(): Observable<UserRow[]> {
    return this.http.get<UserRow[]>(`${API}/users/staff`);
  }

  createStaff(dto: { name: string; email: string; password: string }): Observable<{ id: number }> {
    return this.http.post<{ id: number }>(`${API}/users/staff`, dto);
  }

  resetPassword(id: number, newPassword: string): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${API}/users/${id}/reset-password`, { newPassword });
  }

  setActive(id: number, isActive: boolean): Observable<{ id: number; isActive: boolean }> {
    return this.http.put<{ id: number; isActive: boolean }>(`${API}/users/${id}/active`, { isActive });
  }
}

@Injectable({ providedIn: 'root' })
export class ReportService {
  constructor(private http: HttpClient) {}

  dashboard(): Observable<DashboardData> {
    return this.http.get<DashboardData>(`${API}/reports/dashboard`);
  }

  sales(from?: string, to?: string, categoryId?: number): Observable<SalesReport> {
    let params = new HttpParams();
    if (categoryId) params = params.set('categoryId', categoryId);
    if (from) params = params.set('from', from);
    if (to) params = params.set('to', to);
    return this.http.get<SalesReport>(`${API}/reports/sales`, { params });
  }
}

@Injectable({ providedIn: 'root' })
export class AccountService {
  constructor(private http: HttpClient) {}

  me(): Observable<Profile> {
    return this.http.get<Profile>(`${API}/account/me`);
  }

  update(dto: { name: string; phone: string | null; address: string | null }): Observable<Profile> {
    return this.http.put<Profile>(`${API}/account/me`, dto);
  }

  changePassword(currentPassword: string, newPassword: string): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${API}/account/password`, { currentPassword, newPassword });
  }
}

@Injectable({ providedIn: 'root' })
export class AuditService {
  constructor(private http: HttpClient) {}

  list(page: number, search: string): Observable<AuditPage> {
    let params = new HttpParams().set('page', page).set('pageSize', 20);
    if (search) params = params.set('search', search);
    return this.http.get<AuditPage>(`${API}/audit`, { params });
  }
}
