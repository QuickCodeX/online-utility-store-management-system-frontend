import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { errorMessage } from '../core/api-error';
import { CategoryService } from '../core/api.services';
import { Category } from '../core/models';
import { AdminSession } from '../core/session.service';
import { ToastService } from '../core/toast.service';

@Component({ selector: 'app-categories', templateUrl: './categories.component.html' })
export class CategoriesComponent implements OnInit {
  categories: Category[] = [];
  editing: Category | null = null;   // null = adding a new one
  loading = true;
  saving = false;
  error = '';
  formError = '';

  form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    description: ['', [Validators.maxLength(500)]]
  });

  constructor(private fb: FormBuilder, private service: CategoryService, public session: AdminSession, private toast: ToastService) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.service.manageList().subscribe({
      next: c => { this.categories = c; this.loading = false; },
      error: e => { this.error = errorMessage(e); this.loading = false; }
    });
  }

  edit(c: Category): void {
    this.editing = c;
    this.form.patchValue({ name: c.name, description: c.description ?? '' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancel(): void { this.editing = null; this.form.reset({ name: '', description: '' }); this.formError = ''; }

  save(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    this.saving = true;
    this.formError = '';
    const v = this.form.getRawValue();
    const dto = { name: v.name, description: v.description || null, isActive: this.editing?.isActive !== false };

    const request = this.editing ? this.service.update(this.editing.id, dto) : this.service.create(dto);
    request.subscribe({
      next: () => {
        this.toast.success(this.editing ? 'Category saved.' : 'Category added.');
        this.saving = false;
        this.cancel();
        this.load();
      },
      error: e => { this.formError = errorMessage(e); this.saving = false; }
    });
  }

  toggleActive(c: Category): void {
    const archiving = c.isActive !== false;
    if (archiving && !confirm(`Archive "${c.name}"? Its products will be hidden from the store.`)) return;

    this.service.update(c.id, { name: c.name, description: c.description, isActive: !archiving }).subscribe({
      next: () => { this.toast.success(archiving ? 'Category archived.' : 'Category restored.'); this.load(); },
      error: e => this.toast.error(errorMessage(e))
    });
  }

  remove(c: Category): void {
    if (!confirm(`Delete "${c.name}" permanently?`)) return;
    this.service.delete(c.id).subscribe({
      next: () => { this.toast.success('Category deleted.'); this.load(); },
      error: e => this.toast.error(errorMessage(e))
    });
  }
}
