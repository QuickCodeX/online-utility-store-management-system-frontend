import { Component, OnInit } from '@angular/core';
import { errorMessage } from '../core/api-error';
import { ProductService } from '../core/api.services';
import { Product } from '../core/models';
import { AdminSession } from '../core/session.service';
import { ToastService } from '../core/toast.service';

@Component({ selector: 'app-products', templateUrl: './products.component.html' })
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  filter = '';
  loading = true;
  error = '';

  constructor(private service: ProductService, public session: AdminSession, private toast: ToastService) {}

  ngOnInit(): void { this.load(); }

  get shown(): Product[] {
    const f = this.filter.trim().toLowerCase();
    return f ? this.products.filter(p => p.name.toLowerCase().includes(f) || (p.category ?? '').toLowerCase().includes(f)) : this.products;
  }

  load(): void {
    this.loading = true;
    this.service.manageList().subscribe({
      next: p => { this.products = p; this.loading = false; },
      error: e => { this.error = errorMessage(e); this.loading = false; }
    });
  }

  // Archive hides a product from the storefront without losing its order history
  toggleActive(p: Product): void {
    const archiving = p.isActive !== false;
    if (archiving && !confirm(`Archive "${p.name}"? Customers will no longer see it.`)) return;

    this.service.update(p.id, {
      name: p.name, description: p.description, price: p.price, categoryId: p.categoryId,
      imageUrl: p.imageUrl, isActive: !archiving, initialStock: 0
    }).subscribe({
      next: () => { this.toast.success(archiving ? 'Product archived.' : 'Product restored.'); this.load(); },
      error: e => this.toast.error(errorMessage(e))
    });
  }

  remove(p: Product): void {
    if (!confirm(`Delete "${p.name}" permanently? This cannot be undone.`)) return;
    this.service.delete(p.id).subscribe({
      next: () => { this.toast.success('Product deleted.'); this.load(); },
      error: e => this.toast.error(errorMessage(e))
    });
  }
}
