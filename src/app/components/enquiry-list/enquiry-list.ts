import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { EnquiryService } from '../../services/enquiry/enquiry-service';
import { enquirySchema, IEnquiry, IEnquiryRes, InitialEnquiry } from '../../models/enquiry-model';
import { form, FormField } from '@angular/forms/signals';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-mat-toast';
import { DatePipe, UpperCasePipe } from '@angular/common';
import { StatusService } from '../../services/status/status-service';
import { CategoryService } from '../../services/category/category-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ICategory } from '../../models/category-model';
import { ToastMessages } from '../../const/global-const';

@Component({
  imports: [FormField, UpperCasePipe, DatePipe],
  selector: 'app-enquiry-list',
  styleUrl: './enquiry-list.css',
  templateUrl: './enquiry-list.html',
})
export class EnquiryList {
  private readonly enquiry = inject(EnquiryService);
  private readonly toast = inject(ToastrService);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly enquiryModel = signal(InitialEnquiry);
  protected readonly isModelOpen = signal<boolean>(false);
  protected readonly status = inject(StatusService);
  protected readonly category = inject(CategoryService);
  protected readonly byCategoryId = signal<ICategory[]>([]);
  protected enquiryForm = form(this.enquiryModel, enquirySchema);

  ngOnInit() {
    this.enquiry.getEnquiry.reload();
    this.category.getCategory.reload();
    this.status.getStatus.reload();
  }

  loadEnquiry = computed(() => {
    return this.enquiry.getEnquiry.value()?.data ?? [];
  });

  loadStatus = computed(() => {
    return this.status.getStatus.value()?.data ?? [];
  });

  loadCategory = computed(() => {
    return this.category.getCategory.value()?.data ?? [];
  });

  onEdit(enquiry: IEnquiry, id: number) {
    this.enquiryModel.set({
      enquiryId: enquiry.enquiryId,
      customerName: enquiry.customerName,
      customerEmail: enquiry.customerEmail,
      customerPhone: enquiry.customerPhone,
      message: enquiry.message,
      categoryId: enquiry.categoryId,
      statusId: enquiry.statusId,
      enquiryType: enquiry.enquiryType,
      isConverted: enquiry.isConverted,
      enquiryDate: enquiry.enquiryDate,
      followUpDate: enquiry.followUpDate,
      feedback: enquiry.feedback,
    });
    this.isModelOpen.set(true);
  }

  onUpsert(event: Event) {
    event.preventDefault();
    if (this.enquiryForm().valid()) {
      const value = this.enquiryForm().value();
      const service =
        this.enquiryModel().enquiryId > 0
          ? this.enquiry.putEnquiry(value, value.enquiryId)
          : this.enquiry.postEnquiry(value);

      service.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (res: IEnquiryRes) => {
          this.enquiry.getEnquiry.reload();
          this.toast.info(res.message);
          this.isModelOpen.set(false);
        },
        error: (err: HttpErrorResponse) => {
          this.toast.error(err.error.message);
        },
      });
    } else {
      this.toast.error(ToastMessages.REQUIRED_FIELDS);
    }
  }

  onDelete(id: string) {
    this.enquiry
      .deleteEnquiry(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res: IEnquiryRes) => {
          this.toast.success(res.message);
          this.enquiry.getEnquiry.reload()
        },
        error: (err: HttpErrorResponse) => {
          this.toast.error(err.error.message);
        },
      });
  }

  clearModel() {
    this.enquiryModel.set(InitialEnquiry);
  }

  toggleModel() {
    this.isModelOpen.update((prev) => !prev);
    this.clearModel();
  }
}
