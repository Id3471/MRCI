import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateApt } from './create-apt';

describe('CreateApt', () => {
  let component: CreateApt;
  let fixture: ComponentFixture<CreateApt>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateApt],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateApt);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
