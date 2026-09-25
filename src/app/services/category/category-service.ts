import { computed, inject, Service } from '@angular/core';
import { ICategory, ICategoryRes } from '../../models/category-model';
import { HttpClient, httpResource } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL, API_ENDPOINTS } from '../../const/global-const';

@Service()
export class CategoryService {
  private http = inject(HttpClient);

  getCategory = httpResource<ICategoryRes>(() => {
    return API_URL.BASE + API_ENDPOINTS.Get_Category;
  });

  loadCategory = computed(() => {
    return this.getCategory.value()?.data ?? [];
  });

  private categoryMap = computed(() => {
    const map = new Map<number, string>();
    this.loadCategory().forEach((cat) => {
      map.set(Number(cat.categoryId), cat.categoryName);
    });
    return map;
  });

  getCategoryName(categoryId: string | undefined): string {
    return this.categoryMap().get(Number(categoryId)) || 'Unassigned';
  }

  postCategory(category: ICategory): Observable<ICategoryRes> {
    return this.http.post<ICategoryRes>(API_URL.BASE + API_ENDPOINTS.Create_Category, category);
  }

  putCategory(category: ICategory, id: number): Observable<ICategoryRes> {
    return this.http.put<ICategoryRes>(API_URL.BASE + API_ENDPOINTS.Update_Category + id, category);
  }

  deleteCategory(id: number): Observable<ICategoryRes> {
    return this.http.delete<ICategoryRes>(API_URL.BASE + API_ENDPOINTS.Delete_Category + id);
  }
}
