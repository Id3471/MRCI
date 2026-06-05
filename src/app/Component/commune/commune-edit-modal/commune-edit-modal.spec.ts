import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommuneEditModal } from './commune-edit-modal';

describe('CommuneEditModal', () => {
  let component: CommuneEditModal;
  let fixture: ComponentFixture<CommuneEditModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommuneEditModal],
    }).compileComponents();

    fixture = TestBed.createComponent(CommuneEditModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
