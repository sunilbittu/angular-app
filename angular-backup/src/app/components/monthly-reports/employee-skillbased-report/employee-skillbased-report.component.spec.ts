import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeSkillbasedReportComponent } from './employee-skillbased-report.component';

describe('EmployeeSkillbasedReportComponent', () => {
  let component: EmployeeSkillbasedReportComponent;
  let fixture: ComponentFixture<EmployeeSkillbasedReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeSkillbasedReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeSkillbasedReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
