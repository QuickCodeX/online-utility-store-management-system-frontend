import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { errorMessage } from '../core/api-error';
import { CategoryService, ProductService } from '../core/api.services';
import { Category, Product } from '../core/models';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit, OnDestroy {
  categories: Category[] = [];
  products: Product[] = [];
  loading = true;
  error = '';

  filtersOpen = false;
  // Client-side filters (the catalogue is small, so these need no extra API calls)
  minPrice: number | null = null;
  maxPrice: number | null = null;
  inStockOnly = false;

  categoryId: number | null = null;
  keyword = '';
  sort = 'name';

  private sub?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.categoryService.list().subscribe({ next: c => (this.categories = c), error: () => {} });

    // The address bar (?category=1&q=rice&sort=price_asc) is the source of truth,
    // so refresh, back button and shared links all work.
    this.sub = this.route.queryParamMap.subscribe(params => {
      this.categoryId = params.get('category') ? Number(params.get('category')) : null;
      this.keyword = params.get('q') ?? '';
      this.sort = params.get('sort') ?? 'name';
      this.load();
    });
  }

  ngOnDestroy(): void { this.sub?.unsubscribe(); }

  // The list the customer actually sees: API result narrowed by price and availability
  get visible(): Product[] {
    const min = this.minPrice ? Number(this.minPrice) : 0;
    const max = this.maxPrice ? Number(this.maxPrice) : Infinity;
    return this.products.filter(p => p.price >= min && p.price <= max && (!this.inStockOnly || p.quantity > 0));
  }

  get activeCategory(): Category | undefined {
    return this.categories.find(c => c.id === this.categoryId);
  }

  setCategory(id: number | null): void { this.navigate({ category: id }); }
  setSort(sort: string): void { this.navigate({ sort: sort === 'name' ? null : sort }); }
  clearFilters(): void {
    this.minPrice = null; this.maxPrice = null; this.inStockOnly = false;
    this.navigate({ category: null, q: null, sort: null });
  }

  reload(): void { this.load(); }

  private navigate(change: Record<string, string | number | null>): void {
    this.router.navigate([], { relativeTo: this.route, queryParams: change, queryParamsHandling: 'merge' });
  }

  private load(): void {
    this.loading = true;
    this.error = '';
    this.productService.search({ categoryId: this.categoryId, keyword: this.keyword, sort: this.sort }).subscribe({
      next: p => { this.products = p; this.loading = false; },
      error: e => { this.error = errorMessage(e); this.loading = false; }
    });
  }
}
