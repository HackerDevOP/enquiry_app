import { Component, input } from '@angular/core';
import { IEnquirySingle } from '../../models/enquiry-model';
import { RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
  selector: 'app-customer-response',
  styleUrl: './customer-response.css',
  templateUrl: './customer-response.html',
})
export class CustomerResponse {
  submittedEnquiry = input.required<IEnquirySingle | null>();
}
