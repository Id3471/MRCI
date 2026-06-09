import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateApt } from './update-apt';

describe('UpdateApt', () => {
  let component: UpdateApt;
  let fixture: ComponentFixture<UpdateApt>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateApt],
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateApt);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
