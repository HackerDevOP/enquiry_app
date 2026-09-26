import { describe, expect, it } from 'vitest';
import { EnquiryList } from './enquiry-list';

describe('EnquiryList', () => {
  it('should filter enquiries by customer name', () => {
    const component = Object.create(EnquiryList.prototype) as EnquiryList;
    const rows = [
      {
        enquiryId: 1,
        customerName: 'Alice Johnson',
        customerEmail: '',
        customerPhone: '',
        message: '',
        categoryId: '1',
        statusId: '1',
        enquiryType: 'Mobile',
        isConverted: false,
        enquiryDate: '',
        followUpDate: '',
        feedback: '',
      },
      {
        enquiryId: 2,
        customerName: 'Bob Smith',
        customerEmail: '',
        customerPhone: '',
        message: '',
        categoryId: '1',
        statusId: '1',
        enquiryType: 'Desktop',
        isConverted: false,
        enquiryDate: '',
        followUpDate: '',
        feedback: '',
      },
    ];

    const filtered = component.filterEnquiries(rows, 'alice');

    expect(filtered).toHaveLength(1);
    expect(filtered[0].customerName).toBe('Alice Johnson');
  });
});
