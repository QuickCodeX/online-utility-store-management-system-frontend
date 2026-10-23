import { Component, OnInit } from '@angular/core';
import { errorMessage } from '../core/api-error';
import { ReportService } from '../core/api.services';
import { DashboardData } from '../core/models';
import { AdminSession } from '../core/session.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  data: DashboardData | null = null;
  loading = true;
  error = '';

  constructor(private reports: ReportService, public session: AdminSession) {}

  ngOnInit(): void {
    this.reports.dashboard().subscribe({
      next: d => { this.data = d; this.loading = false; },
      error: e => { this.error = errorMessage(e); this.loading = false; }
    });
  }
}
