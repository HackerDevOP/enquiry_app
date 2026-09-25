import { required, schema } from '@angular/forms/signals';

export interface IStatusRes {
  error: string[];
  result: boolean;
  data: IStatus[];
  message: string;
}

export interface IStatus {
  statusId: number;
  statusName: string;
  isActive: boolean;
}

export const initialStatus: IStatus = {
  statusId: 0,
  statusName: '',
  isActive: false,
};

export const statusSchema = schema<IStatus>((root) => {
  required(root.statusName, { message: 'Status name is required field' });
});
