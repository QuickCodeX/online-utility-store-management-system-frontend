import { Component, OnInit } from '@angular/core';
import { errorMessage } from '../core/api-error';
import { OrderService } from '../core/api.services';
import { OrderSummary } from '../core/models';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css']
})
export class MyOrdersComponent implements OnInit {
  orders: OrderSummary[] = [];
  loading = true;
  error = '';

  constructor(private service: OrderService) {}

  ngOnInit(): void {
    this.service.mine().subscribe({
      next: o => { this.orders = o; this.loading = false; },
      error: e => { this.error = errorMessage(e); this.loading = false; }
    });
  }
}
