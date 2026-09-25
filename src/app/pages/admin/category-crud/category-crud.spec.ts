import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CategoryCrud } from './category-crud';

describe('CategoryCrud', () => {
  let component: CategoryCrud;
  let fixture: ComponentFixture<CategoryCrud>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryCrud],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryCrud);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
