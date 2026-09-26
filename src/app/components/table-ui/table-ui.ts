import { Component, input, output } from '@angular/core';

export type TableColumn<T = any> = {
  key: keyof T | string;
  label: string;
  type?: 'text' | 'badge';
  formatter?: (value: unknown, row: T) => string;
  badgeClass?: string | ((value: unknown, row: T) => string);
};

export type TableAction<T = any> = {
  label: string;
  action: string;
  classes?: string;
};

export type TableRowActionEvent<T = any> = {
  action: string;
  row: T;
};

@Component({
  selector: 'app-table-ui',
  styleUrl: './table-ui.css',
  templateUrl: './table-ui.html',
})
export class TableUi<T = any> {
  columns = input<TableColumn<T>[]>([]);
  rows = input<T[]>([]);
  actions = input<TableAction<T>[]>([]);

  rowAction = output<TableRowActionEvent<T>>();
  rowClick = output<T>();

  getCellValue(row: T, key: keyof T | string): unknown {
    return String(key)
      .split('.')
      .reduce<unknown>((current, part) => {
        const next = current as Record<string, unknown> | null;
        return next ? next[part] : undefined;
      }, row as unknown);
  }

  formatCell(row: T, column: TableColumn<T>): string {
    const value = this.getCellValue(row, column.key);
    return column.formatter ? column.formatter(value, row) : String(value ?? '');
  }

  resolveBadgeClass(column: TableColumn<T>, row: T): string {
    const value = this.getCellValue(row, column.key);
    if (!column.badgeClass) {
      return 'px-2.5 py-1 rounded-full text-xs font-medium bg-sky-500/10 text-sky-400 border border-sky-500/20';
    }

    if (typeof column.badgeClass === 'function') {
      return column.badgeClass(value, row);
    }

    return column.badgeClass;
  }

  onAction(action: TableAction<T>, row: T) {
    this.rowAction.emit({ action: action.action, row });
  }
}
