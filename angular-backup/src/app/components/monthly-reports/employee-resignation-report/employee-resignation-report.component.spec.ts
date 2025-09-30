import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeResignationReportComponent } from './employee-resignation-report.component';

describe('EmployeeResignationReportComponent', () => {
  let component: EmployeeResignationReportComponent;
  let fixture: ComponentFixture<EmployeeResignationReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeResignationReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeResignationReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
