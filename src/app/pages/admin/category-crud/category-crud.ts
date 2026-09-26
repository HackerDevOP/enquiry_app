import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { CategoryService } from '../../../services/category/category-service';
import {
  categorySchema,
  ICategory,
  ICategoryRes,
  initialCategory,
} from '../../../models/category-model';
import { form, FormField } from '@angular/forms/signals';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpErrorResponse } from '@angular/common/http';
import { FieldError } from '../../../components/field-error/field-error';
import { ToastrService } from '../../../services/toast/toast-service';
import { Title } from '@angular/platform-browser';
import { ToastMessages } from '../../../const/global-const';
import { TableAction, TableColumn, TableUi } from '../../../components/table-ui/table-ui';

@Component({
  imports: [FormField, FieldError, TableUi],
  selector: 'app-category-crud',
  styleUrl: './category-crud.css',
  templateUrl: './category-crud.html',
})
export class CategoryCrud {
  private readonly category = inject(CategoryService);
  private readonly title = inject(Title);
  private readonly toast = inject(ToastrService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly categoryModel = signal(initialCategory);
  protected readonly isEditMode = signal<boolean>(false);
  protected readonly categoryColumns: TableColumn<ICategory>[] = [
    { key: 'categoryId', label: 'ID', formatter: (value) => `#${value}` },
    { key: 'categoryName', label: 'Category Name' },
    {
      key: 'isActive',
      label: 'Status',
      type: 'badge',
      formatter: (value) => (value ? 'Active' : 'InActive'),
      badgeClass: (value) =>
        value
          ? 'px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
          : 'px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20',
    },
  ];
  protected readonly categoryActions: TableAction<ICategory>[] = [
    { label: 'Edit', action: 'edit', classes: 'px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition cursor-pointer' },
    { label: 'Delete', action: 'delete', classes: 'px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-medium transition cursor-pointer' },
  ];

  ngOnInit() {
    this.category.getCategory.reload();
    this.title.setTitle('Category List');
  }

  loadCategory = computed(() => {
    return this.category.getCategory.value()?.data ?? [];
  });

  categoryForm = form(this.categoryModel, categorySchema);

  onEdit(category: ICategory) {
    this.categoryModel.set({
      categoryId: category.categoryId,
      categoryName: category.categoryName,
      isActive: category.isActive,
    });
    this.isEditMode.set(true);
  }

  onReset() {
    this.categoryModel.set(initialCategory);
    this.isEditMode.set(false);
  }

  handleTableAction(event: { action: string; row: ICategory }) {
    if (event.action === 'edit') {
      this.onEdit(event.row);
      return;
    }

    if (event.action === 'delete') {
      this.onDelete(event.row.categoryId);
    }
  }

  onUpsert(event: Event) {
    event.preventDefault();
    if (this.categoryForm().valid()) {
      const value = this.categoryForm().value();
      const service$ =
        this.categoryModel().categoryId > 0
          ? this.category.putCategory(value, value.categoryId)
          : this.category.postCategory(value);

      service$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (res: ICategoryRes) => {
          this.toast.show(res.message);
          this.category.getCategory.reload();
          this.isEditMode.set(false);
          this.onReset();
        },
        error: (err: HttpErrorResponse) => {
          this.toast.error(err.error.message);
        },
      });
    } else {
      this.toast.error(ToastMessages.REQUIRED_FIELDS);
    }
  }

  onDelete(id: number) {
    this.category
      .deleteCategory(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res: ICategoryRes) => {
          this.toast.info(res.message);
          this.category.getCategory.reload();
        },
        error: (err: HttpErrorResponse) => {
          this.toast.error(err.error.message);
        },
      });
  }
}
