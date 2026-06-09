import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateQuartier } from './update-quartier';

describe('UpdateQuartier', () => {
  let component: UpdateQuartier;
  let fixture: ComponentFixture<UpdateQuartier>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateQuartier],
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateQuartier);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
