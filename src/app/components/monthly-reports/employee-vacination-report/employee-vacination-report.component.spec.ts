import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeVacinationReportComponent } from './employee-vacination-report.component';

describe('EmployeeVacinationReportComponent', () => {
  let component: EmployeeVacinationReportComponent;
  let fixture: ComponentFixture<EmployeeVacinationReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeVacinationReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeVacinationReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
