import { Title } from '@angular/platform-browser';
import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { StatusService } from '../../../services/status/status-service';
import { initialStatus, IStatus, IStatusRes, statusSchema } from '../../../models/status-model';
import { form, FormField } from '@angular/forms/signals';
import { ToastrService } from 'ngx-mat-toast';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastMessages } from '../../../const/global-const';

@Component({
  imports: [FormField],
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
