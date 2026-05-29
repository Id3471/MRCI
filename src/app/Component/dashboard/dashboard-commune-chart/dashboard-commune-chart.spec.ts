import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardCommuneChart } from './dashboard-commune-chart';

describe('DashboardCommuneChart', () => {
  let component: DashboardCommuneChart;
  let fixture: ComponentFixture<DashboardCommuneChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardCommuneChart],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardCommuneChart);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
