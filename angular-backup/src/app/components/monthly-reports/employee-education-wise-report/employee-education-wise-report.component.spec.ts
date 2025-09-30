import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeEducationWiseReportComponent } from './employee-education-wise-report.component';

describe('EmployeeEducationWiseReportComponent', () => {
  let component: EmployeeEducationWiseReportComponent;
  let fixture: ComponentFixture<EmployeeEducationWiseReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeEducationWiseReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeEducationWiseReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
