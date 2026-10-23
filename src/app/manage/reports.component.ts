import { Component, OnInit } from '@angular/core';
import { errorMessage } from '../core/api-error';
import { CategoryService, ReportService } from '../core/api.services';
import { Category, SalesReport } from '../core/models';

@Component({ selector: 'app-reports', templateUrl: './reports.component.html' })
export class ReportsComponent implements OnInit {
  report: SalesReport | null = null;
  from = '';
  to = '';
  categoryId = 0;
  categories: Category[] = [];
  loading = true;
  error = '';

  constructor(private service: ReportService, private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.categoryService.manageList().subscribe({ next: c => this.categories = c, error: () => undefined });
    this.load();
  }

  get maxDay(): number {
    return this.report?.salesByDay.reduce((m, d) => Math.max(m, d.total), 0) ?? 0;
  }

  load(): void {
    if (this.from && this.to && this.from > this.to) { this.error = 'The start date must be before the end date.'; return; }

    this.loading = true;
    this.error = '';
    this.service.sales(this.from || undefined, this.to || undefined, this.categoryId || undefined).subscribe({
      next: r => { this.report = r; this.loading = false; },
      error: e => { this.error = errorMessage(e); this.loading = false; }
    });
  }

  exportCsv(): void {
    if (!this.report) return;
    const lines = ['Date,Orders,Total', ...this.report.salesByDay.map(d => `${d.date},${d.orders},${d.total}`)];
    const blob = new Blob([lines.join('\n')], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `sales-${this.report.from}-to-${this.report.to}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  }
}
