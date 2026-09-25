import { IEnquiryRes, InitialEnquiry } from './../../models/enquiry-model';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { enquirySchema } from '../../models/enquiry-model';
import { CategoryService } from '../../services/category/category-service';
import { StatusService } from '../../services/status/status-service';
import { EnquiryService } from '../../services/enquiry/enquiry-service';
import { form, FormField } from '@angular/forms/signals';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ToastrService } from 'ngx-mat-toast';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastMessages } from '../../const/global-const';
import { Title } from '@angular/platform-browser';

@Component({
  imports: [FormField],
  selector: 'app-enquiry-form',
  styleUrl: './enquiry-form.css',
  templateUrl: './enquiry-form.html',
})
export class EnquiryForm {
  protected readonly category = inject(CategoryService);
  protected readonly status = inject(StatusService);
  protected readonly enquiry = inject(EnquiryService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly toast = inject(ToastrService);
  private readonly title = inject(Title);

  protected enquiryModel = signal(InitialEnquiry);
  protected enquiryForm = form(this.enquiryModel, enquirySchema);

  constructor() {
    this.title.setTitle('New Enquiry');
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
        },
        error: (err: HttpErrorResponse) => {
          this.toast.error(err.error.message);
        },
      });
    } else {
      this.toast.error(ToastMessages.REQUIRED_FIELDS);
    }
  }

  clearModel() {
    this.enquiryModel.set(InitialEnquiry);
  }
}
