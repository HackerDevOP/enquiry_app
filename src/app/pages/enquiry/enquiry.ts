import { Component, inject, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BRAND } from '../../const/global-const';
import { enquirySchema, InitialEnquiry } from '../../models/enquiry-model';
import { form, FormField } from '@angular/forms/signals';

@Component({
  imports: [FormField],
  selector: 'app-enquiry',
  styleUrl: './enquiry.css',
  templateUrl: './enquiry.html',
})
export class Enquiry {
  private readonly title = inject(Title);
  protected readonly brand = BRAND.Name;
  protected enquiryModel = signal(InitialEnquiry);

  protected enquiryForm = form(this.enquiryModel, enquirySchema);

  ngOnInit() {
    this.title.setTitle('New Enquiry');
  }

  OnSubmit(event:Event) {
    event.preventDefault();
  }
}
