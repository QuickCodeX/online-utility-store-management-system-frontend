import { Component } from '@angular/core';
import { CartService } from '../core/cart.service';
import { CartLine } from '../core/models';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent {
  constructor(public cart: CartService) {}

  onQuantity(productId: number, value: number): void { this.cart.setQuantity(productId, Number(value)); }

  decrease(line: CartLine): void {
    if (line.quantity <= 1) this.cart.remove(line.productId);
    else this.cart.setQuantity(line.productId, line.quantity - 1);
  }
}
