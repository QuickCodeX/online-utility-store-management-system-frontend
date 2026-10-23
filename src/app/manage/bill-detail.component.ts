import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { errorMessage } from '../core/api-error';
import { BillService } from '../core/api.services';
import { BillDetail } from '../core/models';

@Component({
  selector: 'app-bill-detail',
  templateUrl: './bill-detail.component.html',
  styleUrls: ['./bill-detail.component.css']
})
export class BillDetailComponent implements OnInit {
  bill: BillDetail | null = null;
  loading = true;
  error = '';

  constructor(private route: ActivatedRoute, private service: BillService) {}

  ngOnInit(): void {
    this.service.get(Number(this.route.snapshot.paramMap.get('id'))).subscribe({
      next: b => { this.bill = b; this.loading = false; },
      error: e => { this.error = e.status === 404 ? 'Bill not found.' : errorMessage(e); this.loading = false; }
    });
  }

  print(): void { window.print(); }
}
