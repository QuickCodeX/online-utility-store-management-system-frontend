import { Component } from '@angular/core';
import { CartService } from '../core/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent {
  constructor(public cart: CartService) {}

  onQuantity(productId: number, value: number): void { this.cart.setQuantity(productId, Number(value)); }
}
