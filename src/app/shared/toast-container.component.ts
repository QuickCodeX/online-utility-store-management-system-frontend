import { Component } from '@angular/core';
import { ToastService } from '../core/toast.service';

@Component({
  selector: 'app-toasts',
  template: `
    <div class="toasts" aria-live="polite">
      <div *ngFor="let t of toast.toasts$ | async" class="toast" [class.err]="t.kind === 'error'" role="status">
        <span>{{ t.message }}</span>
        <button type="button" class="x" (click)="toast.dismiss(t.id)" aria-label="Dismiss">&times;</button>
      </div>
    </div>
  `,
  styles: [`
    .toasts { position: fixed; right: 1rem; bottom: 1rem; z-index: 1000; display: grid; gap: .5rem; max-width: min(380px, calc(100vw - 2rem)); }
    .toast { display: flex; align-items: flex-start; gap: .75rem; padding: .75rem 1rem; border-radius: 10px;
      background: var(--pine); color: #fff; box-shadow: var(--shadow-md); font-size: .93rem; }
    .toast.err { background: var(--danger); }
    .x { margin-left: auto; background: none; border: 0; color: inherit; font-size: 1.2rem; line-height: 1; cursor: pointer; }
  `]
})
export class ToastContainerComponent {
  constructor(public toast: ToastService) {}
}
