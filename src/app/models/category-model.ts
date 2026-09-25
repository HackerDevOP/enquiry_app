import { required, schema } from '@angular/forms/signals';

export interface ICategoryRes {
  error: string[];
  result: boolean;
  data: ICategory[];
  message: string;
}

export interface ICategory {
  categoryId: number;
  categoryName: string;
  isActive: boolean;
}

export const initialCategory: ICategory = {
  categoryId: 0,
  categoryName: '',
  isActive: false,
};

export const categorySchema = schema<ICategory>((root) => {
  required(root.categoryName, { message: 'Category name is a required field' });
});
