import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardTypologyChart } from './dashboard-typology-chart';

describe('DashboardTypologyChart', () => {
  let component: DashboardTypologyChart;
  let fixture: ComponentFixture<DashboardTypologyChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardTypologyChart],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardTypologyChart);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
