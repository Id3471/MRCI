import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateQuartier } from './create-quartier';

describe('CreateQuartier', () => {
  let component: CreateQuartier;
  let fixture: ComponentFixture<CreateQuartier>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateQuartier],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateQuartier);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
