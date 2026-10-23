import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { errorMessage } from '../core/api-error';
import { ProductService } from '../core/api.services';
import { CartService } from '../core/cart.service';
import { Product } from '../core/models';
import { ToastService } from '../core/toast.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  loading = true;
  error = '';
  quantity = 1;
  related: Product[] = [];

  constructor(
    private route: ActivatedRoute,
    private products: ProductService,
    private cart: CartService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      this.loading = true;
      this.error = '';
      this.quantity = 1;

      this.products.getById(id).subscribe({
        next: p => {
          this.product = p; this.loading = false;
          // "More from this category": other products in the same category
          this.products.search({ categoryId: p.categoryId }).subscribe({
            next: list => (this.related = list.filter(x => x.id !== p.id).slice(0, 4)),
            error: () => (this.related = [])
          });
        },
        error: e => {
          this.product = null;
          this.error = e.status === 404 ? 'This product is no longer available.' : errorMessage(e);
          this.loading = false;
        }
      });
    });
  }

  get inStock(): boolean { return !!this.product && this.product.quantity > 0; }
  get stockText(): string {
    const q = this.product?.quantity ?? 0;
    return q <= 0 ? 'Out of stock' : q < 10 ? `Only ${q} left` : 'In stock';
  }
  get stockClass(): string {
    const q = this.product?.quantity ?? 0;
    return q <= 0 ? 'out' : q < 10 ? 'low' : 'in';
  }

  step(delta: number): void { this.setQuantity(this.quantity + delta); }

  setQuantity(value: number): void {
    const max = this.product?.quantity ?? 1;
    this.quantity = Math.max(1, Math.min(Math.floor(Number(value)) || 1, max));
  }

  add(): void {
    if (!this.product) return;
    const added = this.cart.add(this.product, this.quantity);
    if (added > 0) this.toast.success(`${added} × ${this.product.name} added to your cart.`);
    else this.toast.error('You already have all available stock of this item in your cart.');
  }
}
