import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardProgressList } from './dashboard-progress-list';

describe('DashboardProgressList', () => {
  let component: DashboardProgressList;
  let fixture: ComponentFixture<DashboardProgressList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardProgressList],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardProgressList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
