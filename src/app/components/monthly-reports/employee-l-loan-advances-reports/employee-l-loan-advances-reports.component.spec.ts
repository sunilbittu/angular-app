import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeLLoanAdvancesReportsComponent } from './employee-l-loan-advances-reports.component';

describe('EmployeeLLoanAdvancesReportsComponent', () => {
  let component: EmployeeLLoanAdvancesReportsComponent;
  let fixture: ComponentFixture<EmployeeLLoanAdvancesReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeLLoanAdvancesReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeLLoanAdvancesReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
