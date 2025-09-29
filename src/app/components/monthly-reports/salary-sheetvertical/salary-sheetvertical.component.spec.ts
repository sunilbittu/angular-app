import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalarySheetverticalComponent } from './salary-sheetvertical.component';

describe('SalarySheetverticalComponent', () => {
  let component: SalarySheetverticalComponent;
  let fixture: ComponentFixture<SalarySheetverticalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalarySheetverticalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalarySheetverticalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
