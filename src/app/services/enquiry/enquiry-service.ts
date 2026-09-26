import { computed, inject, Service } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ILogin } from '../../pages/login/login';
import { HttpClient, httpResource } from '@angular/common/http';
import { IEnquiry, IEnquiryRes, IEnquirySingle } from '../../models/enquiry-model';
import { API_ENDPOINTS, API_URL } from '../../const/global-const';

@Service()
export class EnquiryService {
  admin$: BehaviorSubject<ILogin | null> = new BehaviorSubject<ILogin | null>(null);
  http = inject(HttpClient);

  getEnquiry = httpResource<IEnquiryRes>(() => {
    return API_URL.BASE + API_ENDPOINTS.Get_Enquiry;
  });

  loadEnquiry = computed(() => {
    return this.getEnquiry.value()?.data ?? [];
  });

  postEnquiry(enquiry: IEnquiry): Observable<IEnquirySingle> {
    return this.http.post<IEnquirySingle>(API_URL.BASE + API_ENDPOINTS.Create_Enquiry, enquiry);
  }

  putEnquiry(enquiry: IEnquiry, id: number): Observable<IEnquirySingle> {
    return this.http.put<IEnquirySingle>(API_URL.BASE + API_ENDPOINTS.Update_Enquiry + id, enquiry);
  }

  deleteEnquiry(id: string): Observable<IEnquiryRes> {
    return this.http.delete<IEnquiryRes>(API_URL.BASE + API_ENDPOINTS.Delete_Enquiry + id);
  }
}
