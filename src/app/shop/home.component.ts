import { Component, OnInit } from '@angular/core';
import { CategoryService, ProductService } from '../core/api.services';
import { errorMessage } from '../core/api-error';
import { Category, Product } from '../core/models';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  categories: Category[] = [];
  featured: Product[] = [];
  loading = true;
  error = '';

  constructor(private categoryService: CategoryService, private productService: ProductService) {}

  ngOnInit(): void {
    this.categoryService.list().subscribe({
      next: c => (this.categories = c),
      error: e => (this.error = errorMessage(e))
    });

    this.productService.search({ sort: 'newest' }).subscribe({
      next: p => { this.featured = p.slice(0, 8); this.loading = false; },
      error: e => { this.error = errorMessage(e); this.loading = false; }
    });
  }
}
