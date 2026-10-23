import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { errorMessage } from '../core/api-error';
import { AccountService, OrderService } from '../core/api.services';
import { CartService } from '../core/cart.service';
import { StoreSession } from '../core/session.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  placing = false;
  error = '';

  form = this.fb.nonNullable.group({
    deliveryName: ['', [Validators.required, Validators.maxLength(100)]],
    deliveryPhone: ['', [Validators.required, Validators.pattern(/^[0-9+\-\s]{7,20}$/)]],
    deliveryAddress: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(250)]],
    notes: ['', [Validators.maxLength(250)]]
  });

  constructor(
    private fb: FormBuilder,
    public cart: CartService,
    public session: StoreSession,
    private orders: OrderService,
    private accounts: AccountService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.cart.lines.length) { this.router.navigate(['/cart']); return; }

    // Only customers can order. Staff/Admin see an explanation instead of the form.
    if (!this.session.isCustomer()) return;

    // Pre-fill the form from the customer's saved details
    this.accounts.me().subscribe({
      next: p => this.form.patchValue({
        deliveryName: p.name,
        deliveryPhone: p.phone ?? '',
        deliveryAddress: p.address ?? ''
      }),
      error: () => {}
    });
  }

  place(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    this.placing = true;
    this.error = '';
    const v = this.form.getRawValue();

    this.orders.place({
      deliveryName: v.deliveryName,
      deliveryPhone: v.deliveryPhone,
      deliveryAddress: v.deliveryAddress,
      notes: v.notes || null,
      items: this.cart.lines.map(l => ({ productId: l.productId, quantity: l.quantity }))
    }).subscribe({
      next: placed => {
        this.cart.clear();
        this.router.navigate(['/order-confirmation', placed.orderId], {
          state: { orderNumber: placed.orderNumber, total: placed.total }
        });
      },
      error: e => { this.error = errorMessage(e); this.placing = false; }
    });
  }

  invalid(name: 'deliveryName' | 'deliveryPhone' | 'deliveryAddress' | 'notes'): boolean {
    const c = this.form.controls[name];
    return c.touched && c.invalid;
  }
}
