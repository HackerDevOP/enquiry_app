import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EnquiryCrud } from './enquiry-crud';

describe('EnquiryCrud', () => {
  let component: EnquiryCrud;
  let fixture: ComponentFixture<EnquiryCrud>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnquiryCrud],
    }).compileComponents();

    fixture = TestBed.createComponent(EnquiryCrud);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
