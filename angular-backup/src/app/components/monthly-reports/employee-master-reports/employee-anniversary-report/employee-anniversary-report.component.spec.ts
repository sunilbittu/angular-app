import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeAnniversaryReportComponent } from './employee-anniversary-report.component';

describe('EmployeeAnniversaryReportComponent', () => {
  let component: EmployeeAnniversaryReportComponent;
  let fixture: ComponentFixture<EmployeeAnniversaryReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeAnniversaryReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeAnniversaryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
