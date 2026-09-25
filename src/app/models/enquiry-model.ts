import { email, required, schema } from '@angular/forms/signals';

export interface IEnquiryRes {
  error: string[];
  result: boolean;
  data: IEnquiry[];
  message: string;
}

export interface IEnquiry {
  enquiryId: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  message: string;
  categoryId: string;
  statusId: string;
  enquiryType: string;
  isConverted: boolean;
  enquiryDate: string;
  followUpDate: string;
  feedback: string;
}

export const InitialEnquiry: IEnquiry = {
  enquiryId: 0,
  customerName: '',
  customerEmail: '',
  customerPhone: '',
  message: '',
  categoryId: '',
  statusId: '',
  enquiryType: '',
  isConverted: false,
  enquiryDate: Date.now().toLocaleString(),
  followUpDate: Date.now().toLocaleString(),
  feedback: '',
};

export const enquirySchema = schema<IEnquiry>((root) => {
  required(root.customerName, { message: 'Customer name is required' });
  required(root.customerPhone, { message: 'Customer phone number is required' });
  required(root.customerEmail, { message: 'Email is required' });
  email(root.customerEmail, { message: 'Enter a valid email address' });
  required(root.message, { message: 'Message content is required' });
  required(root.enquiryType, { message: 'Please select an enquiry type' });
});
