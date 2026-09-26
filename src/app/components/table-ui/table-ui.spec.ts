import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TableUi } from './table-ui';

describe('TableUi', () => {
  let component: TableUi<Record<string, unknown>>;
  let fixture: ComponentFixture<TableUi<Record<string, unknown>>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableUi],
    }).compileComponents();

    fixture = TestBed.createComponent(TableUi<Record<string, unknown>>);
    component = fixture.componentInstance;
  });

  it('should render configurable columns and actions', () => {
    fixture.componentRef.setInput('columns', [
      { key: 'id', label: 'ID' },
      { key: 'name', label: 'Name' },
      { key: 'status', label: 'Status', type: 'badge' },
    ]);
    fixture.componentRef.setInput('rows', [{ id: 1, name: 'Tony', status: 'Active' }]);
    fixture.componentRef.setInput('actions', [{ label: 'Edit', action: 'edit' }]);

    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Tony');
    expect(text).toContain('Active');
    expect(text).toContain('Edit');
  });
});
