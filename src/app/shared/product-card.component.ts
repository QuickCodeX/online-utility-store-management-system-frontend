import { Component, Input } from '@angular/core';
import { CartPromptService } from '../core/cart-prompt.service';
import { CartService } from '../core/cart.service';
import { Product } from '../core/models';
import { StoreSession } from '../core/session.service';
import { ToastService } from '../core/toast.service';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent {
  @Input({ required: true }) product!: Product;

  private readonly tints = ['#dfe9dc', '#efe6d2', '#dce6ea', '#eadfe4', '#e3e7d3', '#f0dfd4'];

  constructor(private cart: CartService, private toast: ToastService, private prompt: CartPromptService, public session: StoreSession) {}

  get tint(): string { return this.tints[(this.product.categoryId ?? 0) % this.tints.length]; }
  get initials(): string {
    return this.product.name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
  }
  get inStock(): boolean { return this.product.quantity > 0; }
  get lowStock(): boolean { return this.product.quantity > 0 && this.product.quantity < 10; }
  // Stock is shown with a word AND a colour, never colour alone
  get stockText(): string { return !this.inStock ? 'Out of stock' : this.lowStock ? `Only ${this.product.quantity} left` : 'In stock'; }
  get stockClass(): string { return !this.inStock ? 'out' : this.lowStock ? 'low' : 'in'; }

  add(): void {
    const added = this.cart.add(this.product, 1);
    if (added > 0) this.prompt.show({ productId: this.product.id, name: this.product.name, imageUrl: this.product.imageUrl, added });
    else this.toast.error('You already have all available stock of this item in your cart.');
  }
}
