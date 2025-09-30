import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeptWiseGoalReportComponent } from './dept-wise-goal-report.component';

describe('DeptWiseGoalReportComponent', () => {
  let component: DeptWiseGoalReportComponent;
  let fixture: ComponentFixture<DeptWiseGoalReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeptWiseGoalReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeptWiseGoalReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
