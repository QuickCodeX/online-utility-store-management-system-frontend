import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { CartLine, Product } from './models';

const STORAGE_KEY = 'utility_cart';

// The cart lives in the browser only (it is not a database table).
// It becomes an Order + OrderItems when the customer checks out.
// Prices stored here are for display; the server recalculates everything at checkout.
@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly subject = new BehaviorSubject<CartLine[]>(this.read());

  readonly lines$ = this.subject.asObservable();
  readonly count$ = this.lines$.pipe(map(lines => lines.reduce((n, l) => n + l.quantity, 0)));
  readonly subtotal$ = this.lines$.pipe(map(lines => lines.reduce((sum, l) => sum + l.price * l.quantity, 0)));

  get lines(): CartLine[] { return this.subject.value; }

  // Returns how many were actually added (it never goes above the available stock)
  add(product: Product, quantity = 1): number {
    const lines = [...this.lines];
    const existing = lines.find(l => l.productId === product.id);
    const current = existing?.quantity ?? 0;
    const allowed = Math.max(0, Math.min(quantity, product.quantity - current));

    if (allowed === 0) return 0;

    if (existing) {
      existing.quantity += allowed;
      existing.price = product.price;
      existing.maxStock = product.quantity;
    } else {
      lines.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        quantity: allowed,
        maxStock: product.quantity
      });
    }

    this.update(lines);
    return allowed;
  }

  setQuantity(productId: number, quantity: number): void {
    const lines = this.lines.map(l =>
      l.productId === productId
        ? { ...l, quantity: Math.max(1, Math.min(Math.floor(quantity) || 1, l.maxStock)) }
        : l
    );
    this.update(lines);
  }

  remove(productId: number): void {
    this.update(this.lines.filter(l => l.productId !== productId));
  }

  clear(): void {
    this.update([]);
  }

  private update(lines: CartLine[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    this.subject.next(lines);
  }

  private read(): CartLine[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as CartLine[]) : [];
    } catch {
      return [];
    }
  }
}
