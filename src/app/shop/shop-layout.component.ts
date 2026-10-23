import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { CartService } from '../core/cart.service';
import { StoreSession } from '../core/session.service';

@Component({
  selector: 'app-shop-layout',
  templateUrl: './shop-layout.component.html',
  styleUrls: ['./shop-layout.component.css']
})
export class ShopLayoutComponent {
  menuOpen = false;
  year = new Date().getFullYear();

  constructor(
    public session: StoreSession,
    public cart: CartService,
    private auth: AuthService,
    private router: Router
  ) {}

  firstName(full: string): string { return full.split(' ')[0]; }

  search(term: string): void {
    this.router.navigate(['/shop'], { queryParams: { q: term.trim() || null } });
  }

  toggleMenu(e: Event): void {
    e.stopPropagation();
    this.menuOpen = !this.menuOpen;
  }

  // Click anywhere else, or press Escape, to close the account menu
  @HostListener('document:click') closeMenu(): void { this.menuOpen = false; }
  @HostListener('document:keydown.escape') closeOnEscape(): void { this.menuOpen = false; }

  logout(): void {
    this.auth.customerLogout();
    this.menuOpen = false;
    this.router.navigate(['/']);
  }
}
