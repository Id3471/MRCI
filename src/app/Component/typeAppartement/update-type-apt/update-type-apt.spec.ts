import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateTypeApt } from './update-type-apt';

describe('UpdateTypeApt', () => {
  let component: UpdateTypeApt;
  let fixture: ComponentFixture<UpdateTypeApt>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateTypeApt],
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateTypeApt);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
