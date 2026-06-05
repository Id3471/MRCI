import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudPage } from './crud-page';

describe('CrudPage', () => {
  let component: CrudPage;
  let fixture: ComponentFixture<CrudPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrudPage],
    }).compileComponents();

    fixture = TestBed.createComponent(CrudPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
