import { Component, computed, input } from '@angular/core';
import { FieldState } from '@angular/forms/signals';

@Component({
  imports: [],
  selector: 'app-field-error',
  styleUrl: './field-error.css',
  templateUrl: './field-error.html',
})
export class FieldError {
  readonly control = input.required<FieldState<unknown>>();

  protected readonly showError = computed(() => {
    const field = this.control();
    return field.invalid() && field.touched();
  });
}
