import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTypeApt } from './create-type-apt';

describe('CreateTypeApt', () => {
  let component: CreateTypeApt;
  let fixture: ComponentFixture<CreateTypeApt>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateTypeApt],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateTypeApt);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
