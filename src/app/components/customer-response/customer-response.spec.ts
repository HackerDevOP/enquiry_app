import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomerResponse } from './customer-response';

describe('CustomerResponse', () => {
  let component: CustomerResponse;
  let fixture: ComponentFixture<CustomerResponse>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerResponse],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomerResponse);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
