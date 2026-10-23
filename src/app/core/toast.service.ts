import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Toast {
  id: number;
  kind: 'success' | 'error';
  message: string;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private nextId = 1;
  private readonly subject = new BehaviorSubject<Toast[]>([]);
  readonly toasts$ = this.subject.asObservable();

  success(message: string): void { this.push('success', message); }
  error(message: string): void { this.push('error', message); }

  dismiss(id: number): void {
    this.subject.next(this.subject.value.filter(t => t.id !== id));
  }

  private push(kind: Toast['kind'], message: string): void {
    const toast: Toast = { id: this.nextId++, kind, message };
    this.subject.next([...this.subject.value, toast]);
    setTimeout(() => this.dismiss(toast.id), 4500);
  }
}
