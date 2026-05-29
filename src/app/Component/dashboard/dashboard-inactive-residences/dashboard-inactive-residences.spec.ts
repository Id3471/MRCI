import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardInactiveResidences } from './dashboard-inactive-residences';

describe('DashboardInactiveResidences', () => {
  let component: DashboardInactiveResidences;
  let fixture: ComponentFixture<DashboardInactiveResidences>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardInactiveResidences],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardInactiveResidences);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
