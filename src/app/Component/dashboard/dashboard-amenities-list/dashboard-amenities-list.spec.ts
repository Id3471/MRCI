import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardAmenitiesList } from './dashboard-amenities-list';

describe('DashboardAmenitiesList', () => {
  let component: DashboardAmenitiesList;
  let fixture: ComponentFixture<DashboardAmenitiesList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardAmenitiesList],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardAmenitiesList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
