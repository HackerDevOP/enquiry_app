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
import { ToastrService } from 'ngx-mat-toast';
import { FieldError } from '../../../components/field-error/field-error';
import { Title } from '@angular/platform-browser';
import { ToastMessages } from '../../../const/global-const';

@Component({
  imports: [FormField, FieldError],
  selector: 'app-category-crud',
  styleUrl: './category-crud.css',
  templateUrl: './category-crud.html',
})
export class CategoryCrud {
  private readonly category = inject(CategoryService);
  private readonly title = inject(Title)
  private readonly toast = inject(ToastrService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly categoryModel = signal(initialCategory);
  protected readonly isEditMode = signal<boolean>(false);

  ngOnInit() {
    this.category.getCategory.reload();
    this.title.setTitle('Category List')
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
