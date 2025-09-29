import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalarySheetComponent } from './salary-sheet.component';

describe('SalarySheetComponent', () => {
  let component: SalarySheetComponent;
  let fixture: ComponentFixture<SalarySheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalarySheetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalarySheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
