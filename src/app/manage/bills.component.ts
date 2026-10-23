import { Component, OnInit } from '@angular/core';
import { errorMessage } from '../core/api-error';
import { BillService } from '../core/api.services';
import { BillSummary } from '../core/models';

@Component({ selector: 'app-bills', templateUrl: './bills.component.html' })
export class BillsComponent implements OnInit {
  bills: BillSummary[] = [];
  loading = true;
  error = '';

  constructor(private service: BillService) {}

  ngOnInit(): void {
    this.service.list().subscribe({
      next: b => { this.bills = b; this.loading = false; },
      error: e => { this.error = errorMessage(e); this.loading = false; }
    });
  }
}
