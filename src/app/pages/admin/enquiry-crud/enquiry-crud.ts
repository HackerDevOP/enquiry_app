import { Component, inject } from '@angular/core';
import { EnquiryList } from '../../../components/enquiry-list/enquiry-list';
import { Title } from '@angular/platform-browser';

@Component({
  imports: [EnquiryList],
  selector: 'app-enquiry-crud',
  styleUrl: './enquiry-crud.css',
  templateUrl: './enquiry-crud.html',
})
export class EnquiryCrud {
  private readonly title = inject(Title);
  ngOnInit() {
    this.title.setTitle('Enquiry List');
  }
}
