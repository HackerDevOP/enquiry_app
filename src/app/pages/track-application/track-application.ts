import { Component, computed, inject, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { EnquiryService } from '../../services/enquiry/enquiry-service';
import { form, required, FormField } from '@angular/forms/signals';
import { ToastMessages } from '../../const/global-const';
import { ToastrService } from 'ngx-mat-toast';
import { FieldError } from '../../components/field-error/field-error';
import { StatusService } from '../../services/status/status-service';
import { CategoryService } from '../../services/category/category-service';

@Component({
  imports: [FormField, FieldError],
  selector: 'app-track-application',
  styleUrl: './track-application.css',
  templateUrl: './track-application.html',
})
export class TrackApplication {
  private readonly title = inject(Title);
  private readonly enquiry = inject(EnquiryService);
  private readonly toast = inject(ToastrService);
  protected readonly status = inject(StatusService);
  protected readonly category = inject(CategoryService);

  protected readonly trackModel = signal({
    id: '',
  });

  protected trackForm = form(this.trackModel, (root) => {
    required(root.id, { message: ToastMessages.REQUIRED_FIELDS });
  });

  ngOnInit() {
    this.title.setTitle('track-application');
    this.trackApplication();
  }

  onTrack() {
    this.trackApplication();
  }

  trackStatus = computed(() => {
    const status = this.status.getStatus.value()?.data ?? [];
    const enq = this.enquiry.getEnquiry.value()?.data ?? [];

    return status.find((t) => t.statusId == Number());
  });

  trackApplication = computed(() => {
    const data = this.enquiry.getEnquiry.value()?.data ?? [];
    if (this.trackForm().valid()) {
      const value = this.trackForm().value();
      return data.find((t) => t.enquiryId == Number(value.id));
    }
    return null;
  });

  // categoryMap = computed(() => {
  //   const map = new Map<number, string>();
  //   this.category.loadCategory().forEach((cat) => {
  //     map.set(Number(cat.categoryId), cat.categoryName);
  //   });
  //   return map;
  // });

  // statusMap = computed(() => {
  //   const map = new Map<number, string>();
  //   this.status.loadStatus().forEach((status) => {
  //     map.set(Number(status.statusId), status.statusName);
  //   });
  //   return map;
  // });

  // getStatusName(statusId: string | undefined): string {
  //   return this.statusMap().get(Number(statusId)) || 'Unassigned';
  // }

  // getCategoryName(categoryId: string | undefined): string {
  //   return this.categoryMap().get(Number(categoryId)) || 'Unassigned';
  // }
}
