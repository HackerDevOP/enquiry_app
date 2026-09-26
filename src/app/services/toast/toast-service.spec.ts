import { TestBed } from '@angular/core/testing';
import { ToastrService } from './toast-service';

describe('ToastrService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should add and dismiss toast notifications', () => {
    const service = TestBed.inject(ToastrService);

    service.success('Saved successfully');
    service.error('Something went wrong');

    expect(service.toasts().length).toBe(2);

    service.dismiss(service.toasts()[0].id);

    expect(service.toasts().length).toBe(1);
  });
});
