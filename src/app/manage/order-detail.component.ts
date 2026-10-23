import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { errorMessage } from '../core/api-error';
import { BillService, OrderService } from '../core/api.services';
import { NEXT_STATUSES, OrderDetail } from '../core/models';
import { ToastService } from '../core/toast.service';

@Component({ selector: 'app-order-detail', templateUrl: './order-detail.component.html' })
export class OrderDetailComponent implements OnInit {
  order: OrderDetail | null = null;
  loading = true;
  busy = false;
  error = '';

  constructor(
    private route: ActivatedRoute, private router: Router,
    private orders: OrderService, private bills: BillService, private toast: ToastService
  ) {}

  ngOnInit(): void { this.load(); }

  private get id(): number { return Number(this.route.snapshot.paramMap.get('id')); }

  get nextStatuses(): string[] { return this.order ? NEXT_STATUSES[this.order.status] ?? [] : []; }

  get canBill(): boolean {
    return !!this.order && !this.order.billId && (this.order.status === 'Processing' || this.order.status === 'Completed');
  }

  load(): void {
    this.orders.get(this.id).subscribe({
      next: o => { this.order = o; this.loading = false; },
      error: e => { this.error = e.status === 404 ? 'Order not found.' : errorMessage(e); this.loading = false; }
    });
  }

  change(status: string): void {
    if (!this.order) return;
    const message = status === 'Cancelled'
      ? `Cancel order ${this.order.orderNumber}? The stock will be returned to the shelf.`
      : `Mark order ${this.order.orderNumber} as ${status}?`;
    if (!confirm(message)) return;

    this.busy = true;
    this.orders.updateStatus(this.order.id, status).subscribe({
      next: () => { this.toast.success(`Order is now ${status}.`); this.busy = false; this.load(); },
      error: e => { this.toast.error(errorMessage(e)); this.busy = false; }
    });
  }

  generateBill(): void {
    if (!this.order) return;
    this.busy = true;
    this.bills.create(this.order.id).subscribe({
      next: b => { this.toast.success('Bill generated.'); this.busy = false; this.router.navigate(['/admin/bills', b.billId]); },
      error: e => { this.toast.error(errorMessage(e)); this.busy = false; }
    });
  }
}
