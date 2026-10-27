import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { CartPromptService } from '../core/cart-prompt.service';
import { CartService } from '../core/cart.service';

// Popup shown after "Add to cart": keep shopping or go straight to checkout.
@Component({
  selector: 'app-cart-prompt',
  template: `
    <div class="modal-backdrop" *ngIf="prompts.prompt$ | async as p" (click)="prompts.close()">
      <div class="modal card cart-prompt" role="dialog" aria-modal="true" aria-labelledby="cp-title" (click)="$event.stopPropagation()">
        <div class="cp-head">
          <span class="cp-thumb" aria-hidden="true">
            <img *ngIf="p.imageUrl; else ini" [src]="p.imageUrl" alt="">
            <ng-template #ini><span>{{ p.name.slice(0, 2).toUpperCase() }}</span></ng-template>
          </span>
          <div>
            <h2 id="cp-title">Added to your cart</h2>
            <p class="cp-name">{{ p.added }} × {{ p.name }}</p>
          </div>
        </div>
        <p class="cp-sum">Your cart: {{ cart.count$ | async }} item(s) &middot; <strong>{{ (cart.subtotal$ | async) | money }}</strong></p>
        <div class="cp-actions">
          <button type="button" class="btn btn-outline" (click)="prompts.close()">Continue shopping</button>
          <button type="button" class="btn" (click)="checkout()">Checkout</button>
        </div>
        <a class="cp-link" routerLink="/cart" (click)="prompts.close()">View cart</a>
      </div>
    </div>
  `,
  styles: [`
    .cp-head { display: flex; gap: var(--s-4); align-items: center; }
    .cp-head h2 { margin: 0; }
    .cp-name { margin: .25rem 0 0; color: var(--muted, #5b6b66); }
    .cp-thumb { flex: 0 0 56px; width: 56px; height: 56px; border-radius: 10px; overflow: hidden; display: grid; place-items: center; background: #e3eee9; font-weight: 700; }
    .cp-thumb img { width: 100%; height: 100%; object-fit: cover; }
    .cp-sum { margin: var(--s-4) 0; }
    .cp-actions { display: flex; gap: var(--s-3); flex-wrap: wrap; }
    .cp-actions .btn { flex: 1 1 140px; }
    .cp-link { display: inline-block; margin-top: var(--s-3); font-size: .9rem; }
  `]
})
export class CartPromptComponent {
  constructor(public prompts: CartPromptService, public cart: CartService, private router: Router) {}

  @HostListener('document:keydown.escape')
  onEscape(): void { this.prompts.close(); }

  checkout(): void {
    this.prompts.close();
    this.router.navigateByUrl('/checkout');   // the checkout guard sends guests to log in first
  }
}
