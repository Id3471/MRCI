import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateProfil } from './update-profil';

describe('UpdateProfil', () => {
  let component: UpdateProfil;
  let fixture: ComponentFixture<UpdateProfil>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateProfil],
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateProfil);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
