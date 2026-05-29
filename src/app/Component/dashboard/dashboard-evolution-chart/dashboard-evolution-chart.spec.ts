import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardEvolutionChart } from './dashboard-evolution-chart';

describe('DashboardEvolutionChart', () => {
  let component: DashboardEvolutionChart;
  let fixture: ComponentFixture<DashboardEvolutionChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardEvolutionChart],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardEvolutionChart);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
