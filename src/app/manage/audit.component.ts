import { Component, OnInit } from '@angular/core';
import { errorMessage } from '../core/api-error';
import { AuditService } from '../core/api.services';
import { AuditPage } from '../core/models';

// Admin only: read-only history of sensitive actions (who did what, when)
@Component({ selector: 'app-audit', templateUrl: './audit.component.html' })
export class AuditComponent implements OnInit {
  data: AuditPage | null = null;
  page = 1;
  search = '';
  loading = true;
  error = '';

  constructor(private service: AuditService) {}

  ngOnInit(): void { this.load(); }

  get lastPage(): number {
    return this.data ? Math.max(1, Math.ceil(this.data.total / this.data.pageSize)) : 1;
  }

  find(): void { this.page = 1; this.load(); }

  go(delta: number): void {
    this.page = Math.min(this.lastPage, Math.max(1, this.page + delta));
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = '';
    this.service.list(this.page, this.search.trim()).subscribe({
      next: d => { this.data = d; this.loading = false; },
      error: e => { this.error = errorMessage(e); this.loading = false; }
    });
  }
}
