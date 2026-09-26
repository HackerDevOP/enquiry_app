import { Component, inject, Injectable, signal, type Signal } from '@angular/core';
import { NgClass } from '@angular/common';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastItem {
  id: number;
  type: ToastType;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class ToastrService {
  private id = 0;
  private readonly _toasts = signal<ToastItem[]>([]);

  readonly toasts: Signal<ToastItem[]> = this._toasts;

  success(message: string) {
    this.show('success', message);
  }

  error(message: string) {
    this.show('error', message);
  }

  info(message: string) {
    this.show('info', message);
  }

  show(message: string): void;
  show(type: ToastType, message: string): void;
  show(typeOrMessage: ToastType | string, message?: string) {
    const type: ToastType = typeof typeOrMessage === 'string' && (typeOrMessage === 'success' || typeOrMessage === 'error' || typeOrMessage === 'info')
      ? typeOrMessage
      : 'info';
    const finalMessage = typeof typeOrMessage === 'string' && (typeOrMessage === 'success' || typeOrMessage === 'error' || typeOrMessage === 'info')
      ? message ?? ''
      : typeOrMessage;

    const toast: ToastItem = { id: ++this.id, type, message: finalMessage };
    this._toasts.update((items) => [...items, toast]);

    setTimeout(() => this.dismiss(toast.id), 3000);
  }

  dismiss(id: number) {
    this._toasts.update((items) => items.filter((toast) => toast.id !== id));
  }
}

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [NgClass],
  template: `
    @if (toasts().length) {
      <div class="fixed right-4 top-4 z-9999 flex w-[min(90vw,22rem)] flex-col gap-2">
        @for (toast of toasts(); track toast.id) {
          <div
            [ngClass]="{
              'bg-emerald-500/95 text-emerald-50': toast.type === 'success',
              'bg-rose-500/95 text-rose-50': toast.type === 'error',
              'bg-sky-500/95 text-sky-50': toast.type === 'info'
            }"
            class="rounded-xl border border-white/10 px-4 py-3 shadow-lg backdrop-blur-sm"
          >
            <div class="flex items-start justify-between gap-3">
              <span class="text-sm font-medium">{{ toast.message }}</span>
              <button
                type="button"
                aria-label="Dismiss notification"
                class="ml-2 text-sm font-bold opacity-80 transition hover:opacity-100"
                (click)="dismiss(toast.id)"
              >
                ×
              </button>
            </div>
          </div>
        }
      </div>
    }
  `,
})
export class ToastContainer {
  private readonly toastService = inject(ToastrService);
  readonly toasts = this.toastService.toasts;

  dismiss(id: number) {
    this.toastService.dismiss(id);
  }
}
