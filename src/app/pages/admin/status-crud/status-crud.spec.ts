import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StatusCrud } from './status-crud';

describe('StatusCrud', () => {
  let component: StatusCrud;
  let fixture: ComponentFixture<StatusCrud>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatusCrud],
    }).compileComponents();

    fixture = TestBed.createComponent(StatusCrud);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
