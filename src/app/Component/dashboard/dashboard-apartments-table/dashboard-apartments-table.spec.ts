import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardApartmentsTable } from './dashboard-apartments-table';

describe('DashboardApartmentsTable', () => {
  let component: DashboardApartmentsTable;
  let fixture: ComponentFixture<DashboardApartmentsTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardApartmentsTable],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardApartmentsTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
