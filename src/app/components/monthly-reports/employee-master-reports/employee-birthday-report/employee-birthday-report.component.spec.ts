import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeBirthdayReportComponent } from './employee-birthday-report.component';

describe('EmployeeBirthdayReportComponent', () => {
  let component: EmployeeBirthdayReportComponent;
  let fixture: ComponentFixture<EmployeeBirthdayReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeBirthdayReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeBirthdayReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
