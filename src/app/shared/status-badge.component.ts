import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-status-badge',
  template: `<span class="badge" [ngClass]="cssClass">{{ status }}</span>`
})
export class StatusBadgeComponent {
  @Input() status = '';

  get cssClass(): string {
    switch (this.status) {
      case 'Completed':
      case 'Paid':
        return 'badge-ok';
      case 'Pending':
      case 'Unpaid':
        return 'badge-warn';
      case 'Confirmed':
      case 'Processing':
        return 'badge-info';
      case 'Cancelled':
        return 'badge-danger';
      default:
        return '';
    }
  }
}
