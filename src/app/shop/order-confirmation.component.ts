import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../core/api.services';
import { OrderDetail } from '../core/models';

@Component({
  selector: 'app-order-confirmation',
  templateUrl: './order-confirmation.component.html',
  styleUrls: ['./order-confirmation.component.css']
})
export class OrderConfirmationComponent implements OnInit {
  order: OrderDetail | null = null;
  error = '';

  constructor(private route: ActivatedRoute, private orders: OrderService, private router: Router) {}

  // Loaded from the API (not from browser state) so a refresh still shows the real order.
  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.orders.get(id).subscribe({
      next: o => (this.order = o),
      error: () => this.router.navigate(['/orders'])
    });
  }
}
