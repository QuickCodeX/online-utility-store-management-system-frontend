import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { errorMessage } from '../core/api-error';
import { OrderService } from '../core/api.services';
import { OrderDetail } from '../core/models';
import { ToastService } from '../core/toast.service';

// Read-only order details for the customer who owns the order
@Component({
  selector: 'app-order-view',
  templateUrl: './order-view.component.html',
  styleUrls: ['./my-orders.component.css']
})
export class OrderViewComponent implements OnInit {
  order: OrderDetail | null = null;
  loading = true;
  error = '';

  cancelling = false;

  constructor(private route: ActivatedRoute, private service: OrderService, private toast: ToastService) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.service.get(id).subscribe({
      next: o => { this.order = o; this.loading = false; },
      error: e => {
        this.error = e.status === 403 || e.status === 404 ? 'We could not find that order in your account.' : errorMessage(e);
        this.loading = false;
      }
    });
  }

  cancel(): void {
    if (!this.order || !confirm('Cancel this order? Your items will go back into stock.')) return;
    this.cancelling = true;
    this.service.cancelMine(this.order.id).subscribe({
      next: r => {
        if (this.order) { this.order = { ...this.order, status: r.status }; }
        this.toast.success('Your order was cancelled.');
        this.cancelling = false;
      },
      error: e => { this.toast.error(errorMessage(e)); this.cancelling = false; }
    });
  }
}
