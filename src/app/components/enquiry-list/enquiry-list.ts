import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { EnquiryService } from '../../services/enquiry/enquiry-service';
import {
  enquirySchema,
  IEnquiry,
  IEnquiryRes,
  IEnquirySingle,
  InitialEnquiry,
  initialFilter,
} from '../../models/enquiry-model';
import { form, FormField } from '@angular/forms/signals';
import { HttpErrorResponse } from '@angular/common/http';
import { StatusService } from '../../services/status/status-service';
import { ToastrService } from '../../services/toast/toast-service';
import { CategoryService } from '../../services/category/category-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ICategory } from '../../models/category-model';
import { ToastMessages } from '../../const/global-const';
import { TableAction, TableColumn, TableUi } from '../table-ui/table-ui';

@Component({
  imports: [TableUi, FormField],
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
  protected readonly enquiryColumns: TableColumn<IEnquiry>[] = [
    {
      key: 'enquiryId',
      label: 'ID & Customer',
      formatter: (value, row) => `#ENQ-${value}`,
    },
    {
      key: 'customerName',
      label: 'Customer',
      formatter: (value) => String(value ?? ''),
    },
    {
      key: 'customerEmail',
      label: 'Contact Info',
      formatter: (value, row) => `${String(value ?? '')} / ${String(row.customerPhone ?? '')}`,
    },
    {
      key: 'enquiryType',
      label: 'Type',
      type: 'badge',
      formatter: (value) => String(value ?? 'NA'),
      badgeClass: () =>
        'px-2.5 py-1 rounded-full text-xs font-medium bg-sky-500/10 text-sky-400 border border-sky-500/20',
    },
    {
      key: 'categoryId',
      label: 'Status / Cat',
      formatter: (value, row) =>
        `${this.category.getCategoryName(String(value))} / ${this.status.getStatusName(row.statusId)}`,
    },
    {
      key: 'followUpDate',
      label: 'Follow-up Date',
      formatter: (value) => (value ? new Date(String(value)).toLocaleString() : 'N/A'),
    },
  ];
  protected readonly enquiryActions: TableAction<IEnquiry>[] = [
    {
      label: 'Edit',
      action: 'edit',
      classes:
        'px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition cursor-pointer',
    },
    {
      label: 'Delete',
      action: 'delete',
      classes:
        'px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-medium transition cursor-pointer',
    },
  ];

  ngOnInit() {
    this.enquiry.getEnquiry.reload();
    this.category.getCategory.reload();
    this.status.getStatus.reload();
  }

  protected readonly filterModel = signal(initialFilter);
  protected filterForm = form(this.filterModel, (root) => {});

  filterEnquiries(rows: IEnquiry[], customerName: string): IEnquiry[] {
    const term = (customerName ?? '').trim().toLowerCase();
    if (!term) {
      return rows;
    }

    return rows.filter((row) =>
      String(row.customerName ?? '')
        .toLowerCase()
        .includes(term),
    );
  }

  filteredEnquiries = computed(() => {
    const query = this.filterForm().value().customerName ?? '';
    return this.filterEnquiries(this.loadEnquiry(), query);
  });

  loadEnquiry = computed(() => {
    return this.enquiry.getEnquiry.value()?.data ?? [];
  });

  loadStatus = computed(() => {
    return this.status.getStatus.value()?.data ?? [];
  });

  loadCategory = computed(() => {
    return this.category.getCategory.value()?.data ?? [];
  });

  handleTableAction(event: { action: string; row: IEnquiry }) {
    if (event.action === 'edit') {
      this.onEdit(event.row, event.row.enquiryId);
      return;
    }

    if (event.action === 'delete') {
      this.onDelete(event.row.enquiryId.toString());
    }
  }

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
        next: (res: IEnquirySingle) => {
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
          this.enquiry.getEnquiry.reload();
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
