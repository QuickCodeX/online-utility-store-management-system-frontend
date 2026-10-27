import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface CartPromptData {
  productId: number;
  name: string;
  imageUrl: string | null;
  added: number;
}

// Tells the "Added to your cart" popup what to show. null = popup closed.
@Injectable({ providedIn: 'root' })
export class CartPromptService {
  private readonly subject = new BehaviorSubject<CartPromptData | null>(null);
  readonly prompt$ = this.subject.asObservable();

  show(data: CartPromptData): void { this.subject.next(data); }
  close(): void { this.subject.next(null); }
}
