import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateProfil } from './create-profil';

describe('CreateProfil', () => {
  let component: CreateProfil;
  let fixture: ComponentFixture<CreateProfil>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateProfil],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateProfil);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
