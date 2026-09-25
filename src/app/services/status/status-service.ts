import { HttpClient, httpResource } from '@angular/common/http';
import { computed, inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL, API_ENDPOINTS } from '../../const/global-const';
import { IStatus, IStatusRes } from '../../models/status-model';

@Service()
export class StatusService {
  private http = inject(HttpClient);

  getStatus = httpResource<IStatusRes>(() => {
    return API_URL.BASE + API_ENDPOINTS.Get_Status;
  });

  loadStatus = computed(() => {
    return this.getStatus.value()?.data ?? [];
  });

  private statusMap = computed(() => {
    const map = new Map<number, string>();
    this.loadStatus().forEach((status) => {
      map.set(Number(status.statusId), status.statusName);
    });
    return map;
  });

  getStatusName(statusId: string | undefined): string {
    return this.statusMap().get(Number(statusId)) || 'Unassigned';
  }

  postStatus(status: IStatus): Observable<IStatusRes> {
    return this.http.post<IStatusRes>(API_URL.BASE + API_ENDPOINTS.Create_Status, status);
  }

  putStatus(status: IStatus, id: number): Observable<IStatusRes> {
    return this.http.put<IStatusRes>(API_URL.BASE + API_ENDPOINTS.Update_Status + id, status);
  }

  deleteStatus(id: number): Observable<IStatusRes> {
    return this.http.delete<IStatusRes>(API_URL.BASE + API_ENDPOINTS.Delete_Status + id);
  }
}
