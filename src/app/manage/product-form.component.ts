import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { errorMessage } from '../core/api-error';
import { CategoryService, ProductService } from '../core/api.services';
import { Category } from '../core/models';
import { ToastService } from '../core/toast.service';

// One form for both "Add product" and "Edit product"
@Component({ selector: 'app-product-form', templateUrl: './product-form.component.html' })
export class ProductFormComponent implements OnInit {
  id: number | null = null;
  categories: Category[] = [];
  loading = true;
  saving = false;
  error = '';

  form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(150)]],
    description: ['', [Validators.maxLength(500)]],
    price: [0, [Validators.required, Validators.min(0.01)]],
    categoryId: [0, [Validators.required, Validators.min(1)]],
    imageUrl: ['', [Validators.maxLength(300)]],
    initialStock: [0, [Validators.required, Validators.min(0)]],
    isActive: [true]
  });

  constructor(
    private fb: FormBuilder, private route: ActivatedRoute, private router: Router,
    private products: ProductService, private categoryService: CategoryService, private toast: ToastService
  ) {}

  get isEdit(): boolean { return this.id !== null; }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.id = idParam ? Number(idParam) : null;

    this.categoryService.manageList().subscribe({
      next: cats => {
        this.categories = cats;
        if (!this.isEdit) { this.loading = false; return; }
        this.loadProduct();
      },
      error: e => { this.error = errorMessage(e); this.loading = false; }
    });
  }

  private loadProduct(): void {
    this.products.manageList().subscribe({
      next: list => {
        const p = list.find(x => x.id === this.id);
        if (!p) { this.error = 'Product not found.'; this.loading = false; return; }
        this.form.patchValue({
          name: p.name, description: p.description, price: p.price, categoryId: p.categoryId,
          imageUrl: p.imageUrl ?? '', initialStock: p.quantity, isActive: p.isActive !== false
        });
        // Stock is changed from the Inventory page, not here
        this.form.controls.initialStock.disable();
        this.loading = false;
      },
      error: e => { this.error = errorMessage(e); this.loading = false; }
    });
  }

  save(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    this.saving = true;
    this.error = '';
    const v = this.form.getRawValue();
    const dto = {
      name: v.name, description: v.description, price: Number(v.price), categoryId: Number(v.categoryId),
      imageUrl: v.imageUrl || null, isActive: v.isActive, initialStock: Number(v.initialStock)
    };

    const request = this.isEdit ? this.products.update(this.id!, dto) : this.products.create(dto);
    request.subscribe({
      next: () => {
        this.toast.success(this.isEdit ? 'Product saved.' : 'Product added. It is now in the store.');
        this.router.navigate(['/admin/products']);
      },
      error: e => { this.error = errorMessage(e); this.saving = false; }
    });
  }

  bad(name: 'name' | 'price' | 'categoryId' | 'initialStock'): boolean {
    const c = this.form.controls[name];
    return c.touched && c.invalid;
  }
}
