import { Component, OnInit } from '@angular/core';
import { errorMessage } from '../core/api-error';
import { InventoryService } from '../core/api.services';
import { InventoryRow } from '../core/models';
import { ToastService } from '../core/toast.service';

@Component({ selector: 'app-inventory', templateUrl: './inventory.component.html' })
export class InventoryComponent implements OnInit {
  rows: InventoryRow[] = [];
  onlyLow = false;
  loading = true;
  error = '';
  busyId: number | null = null;

  // Typed-in values, keyed by product id
  receiveQty: Record<number, number> = {};
  setQty: Record<number, number> = {};

  constructor(private service: InventoryService, private toast: ToastService) {}

  ngOnInit(): void { this.load(); }

  get shown(): InventoryRow[] { return this.onlyLow ? this.rows.filter(r => r.isLowStock) : this.rows; }

  load(): void {
    this.service.list().subscribe({
      next: r => { this.rows = r; this.loading = false; },
      error: e => { this.error = errorMessage(e); this.loading = false; }
    });
  }

  receive(r: InventoryRow): void {
    const qty = Number(this.receiveQty[r.productId]);
    if (!Number.isInteger(qty) || qty < 1) { this.toast.error('Enter a whole number of 1 or more to receive.'); return; }

    this.busyId = r.productId;
    this.service.receive(r.productId, qty).subscribe({
      next: () => { this.toast.success(`Added ${qty} to ${r.productName}.`); this.receiveQty[r.productId] = 0; this.busyId = null; this.load(); },
      error: e => { this.toast.error(errorMessage(e)); this.busyId = null; }
    });
  }

  set(r: InventoryRow): void {
    const raw = this.setQty[r.productId];
    const qty = Number(raw);
    if (raw === undefined || raw === null || (raw as unknown) === '' || !Number.isInteger(qty) || qty < 0) {
      this.toast.error('Enter a whole number of 0 or more.'); return;
    }
    if (!confirm(`Set the stock of "${r.productName}" to ${qty}?`)) return;

    this.busyId = r.productId;
    this.service.setStock(r.productId, qty).subscribe({
      next: () => { this.toast.success(`Stock of ${r.productName} set to ${qty}.`); delete this.setQty[r.productId]; this.busyId = null; this.load(); },
      error: e => { this.toast.error(errorMessage(e)); this.busyId = null; }
    });
  }
}
