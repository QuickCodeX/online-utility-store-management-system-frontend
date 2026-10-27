import { Component, OnInit } from '@angular/core';
import { errorMessage } from '../core/api-error';
import { AuditService } from '../core/api.services';
import { AuditPage } from '../core/models';
import { ToastService } from '../core/toast.service';

// Admin only: read-only history of sensitive actions (who did what, when)
@Component({ selector: 'app-audit', templateUrl: './audit.component.html' })
export class AuditComponent implements OnInit {
  data: AuditPage | null = null;
  page = 1;
  search = '';
  loading = true;
  error = '';
  confirmingClear = false;
  clearing = false;

  constructor(private service: AuditService, private toast: ToastService) {}

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

  // Admin only. The API also enforces this, and writes one new entry recording who cleared the log.
  clearLog(): void {
    this.clearing = true;
    this.service.clear().subscribe({
      next: r => {
        this.toast.success(`Audit log cleared (${r.removed} entries removed).`);
        this.confirmingClear = false; this.clearing = false; this.page = 1; this.load();
      },
      error: e => { this.toast.error(errorMessage(e)); this.clearing = false; }
    });
  }
}
