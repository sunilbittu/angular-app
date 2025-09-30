import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeEducationSummaryReportComponent } from './employee-education-summary-report.component';

describe('EmployeeEducationSummaryReportComponent', () => {
  let component: EmployeeEducationSummaryReportComponent;
  let fixture: ComponentFixture<EmployeeEducationSummaryReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeEducationSummaryReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeEducationSummaryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
