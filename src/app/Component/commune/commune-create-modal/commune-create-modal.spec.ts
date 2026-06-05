import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommuneCreateModal } from './commune-create-modal';

describe('CommuneCreateModal', () => {
  let component: CommuneCreateModal;
  let fixture: ComponentFixture<CommuneCreateModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommuneCreateModal],
    }).compileComponents();

    fixture = TestBed.createComponent(CommuneCreateModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
