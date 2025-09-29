import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpWiseGoalReportComponent } from './emp-wise-goal-report.component';

describe('EmpWiseGoalReportComponent', () => {
  let component: EmpWiseGoalReportComponent;
  let fixture: ComponentFixture<EmpWiseGoalReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmpWiseGoalReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpWiseGoalReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
