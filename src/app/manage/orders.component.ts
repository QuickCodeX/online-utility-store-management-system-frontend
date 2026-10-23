import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { errorMessage } from '../core/api-error';
import { OrderService } from '../core/api.services';
import { ORDER_STATUSES, OrderSummary } from '../core/models';

@Component({ selector: 'app-orders', templateUrl: './orders.component.html' })
export class OrdersComponent implements OnInit, OnDestroy {
  orders: OrderSummary[] = [];
  statuses = ORDER_STATUSES;
  status = '';
  search = '';
  loading = true;
  error = '';
  private sub?: Subscription;

  constructor(private service: OrderService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.sub = this.route.queryParamMap.subscribe(p => {
      this.status = p.get('status') ?? '';
      this.search = p.get('q') ?? '';
      this.load();
    });
  }

  ngOnDestroy(): void { this.sub?.unsubscribe(); }

  apply(): void {
    this.router.navigate([], { relativeTo: this.route, queryParams: { status: this.status || null, q: this.search.trim() || null } });
  }

  private load(): void {
    this.loading = true;
    this.error = '';
    this.service.all(this.status || undefined, this.search || undefined).subscribe({
      next: o => { this.orders = o; this.loading = false; },
      error: e => { this.error = errorMessage(e); this.loading = false; }
    });
  }
}
