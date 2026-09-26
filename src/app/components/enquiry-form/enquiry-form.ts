import { IEnquirySingle, InitialEnquiry } from './../../models/enquiry-model';
import { Component, DestroyRef, inject, input, signal } from '@angular/core';
import { enquirySchema } from '../../models/enquiry-model';
import { CategoryService } from '../../services/category/category-service';
import { StatusService } from '../../services/status/status-service';
import { EnquiryService } from '../../services/enquiry/enquiry-service';
import { form, FormField } from '@angular/forms/signals';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from '../../services/toast/toast-service';
import { ToastMessages } from '../../const/global-const';
import { Title } from '@angular/platform-browser';
import { FieldError } from '../field-error/field-error';
import { CustomerResponse } from '../customer-response/customer-response';
import { Router } from '@angular/router';

@Component({
  imports: [FormField, FieldError, CustomerResponse],
  selector: 'app-enquiry-form',
  styleUrl: './enquiry-form.css',
  templateUrl: './enquiry-form.html',
})
export class EnquiryForm {
  readonly title = input<string>('Enquiry Management Form');
  readonly showHeader = input<boolean>(true);
  readonly submitLabel = input<string>('Create Enquiry');

  protected readonly category = inject(CategoryService);
  protected readonly status = inject(StatusService);
  protected readonly enquiry = inject(EnquiryService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly toast = inject(ToastrService);
  private readonly pageTitle = inject(Title);
  private readonly route = inject(Router);

  protected enquiryModel = signal(InitialEnquiry);
  protected submittedEnquiry = signal<IEnquirySingle | null>(null);
  protected enquiryForm = form(this.enquiryModel, enquirySchema);

  constructor() {
    this.pageTitle.setTitle('New Enquiry');
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
        next: (res: IEnquirySingle) => {
          this.submittedEnquiry.set(res);
          this.clearModel();
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
