import { Title } from '@angular/platform-browser';
import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { StatusService } from '../../../services/status/status-service';
import { initialStatus, IStatus, IStatusRes, statusSchema } from '../../../models/status-model';
import { form, FormField } from '@angular/forms/signals';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ToastrService } from '../../../services/toast/toast-service';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastMessages } from '../../../const/global-const';
import { TableAction, TableColumn, TableUi } from '../../../components/table-ui/table-ui';
import { FieldError } from '../../../components/field-error/field-error';

@Component({
  imports: [FormField, TableUi, FieldError],
  selector: 'app-status-crud',
  styleUrl: './status-crud.css',
  templateUrl: './status-crud.html',
})
export class StatusCrud {
  private readonly status = inject(StatusService);
  private readonly title = inject(Title);
  private readonly destroyRef = inject(DestroyRef);
  private readonly toast = inject(ToastrService);
  protected readonly statusModel = signal(initialStatus);
  protected readonly isEditMode = signal<boolean>(false);
  protected readonly statusColumns: TableColumn<IStatus>[] = [
    { key: 'statusId', label: 'ID', formatter: (value) => `#${value}` },
    { key: 'statusName', label: 'Status Name' },
    {
      key: 'isActive',
      label: 'State',
      type: 'badge',
      formatter: (value) => (value ? 'Active' : 'InActive'),
      badgeClass: (value) =>
        value
          ? 'px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
          : 'px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20',
    },
  ];
  protected readonly statusActions: TableAction<IStatus>[] = [
    { label: 'Edit', action: 'edit', classes: 'px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition cursor-pointer' },
    { label: 'Delete', action: 'delete', classes: 'px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-medium transition cursor-pointer' },
  ];

  ngOnInit() {
    this.title.setTitle('Status List');
    this.status.getStatus.reload();
  }

  protected statusForm = form(this.statusModel, statusSchema);

  loadStatus = computed(() => {
    return this.status.getStatus.value()?.data ?? [];
  });

  onReset() {
    this.statusModel.set(initialStatus);
    this.isEditMode.set(false);
  }

  onEdit(status: IStatus) {
    this.statusModel.set({
      statusId: status.statusId,
      statusName: status.statusName,
      isActive: status.isActive,
    });
    this.isEditMode.set(true);
  }

  onDelete(id: number) {
    this.status
      .deleteStatus(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res: IStatusRes) => {
          this.toast.success(res.message);
          this.status.getStatus.reload();
        },
        error: (err: HttpErrorResponse) => {
          this.toast.error(err.error.message);
        },
      });
  }

  handleTableAction(event: { action: string; row: IStatus }) {
    if (event.action === 'edit') {
      this.onEdit(event.row);
      return;
    }

    if (event.action === 'delete') {
      this.onDelete(event.row.statusId);
    }
  }

  onUpsert(event: SubmitEvent) {
    event.preventDefault();
    if (this.statusForm().valid()) {
      const value = this.statusForm().value();

      const service$ =
        this.statusModel().statusId > 0
          ? this.status.putStatus(value, value.statusId)
          : this.status.postStatus(value);
      service$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (res: IStatusRes) => {
          this.toast.info(res.message);
          this.status.getStatus.reload();
          this.onReset();
          this.isEditMode.set(false);
        },
        error: (err: HttpErrorResponse) => {
          this.toast.error(ToastMessages.SERVER_ERROR);
        },
      });
    } else {
      this.toast.error(ToastMessages.REQUIRED_FIELDS);
    }
  }
}
