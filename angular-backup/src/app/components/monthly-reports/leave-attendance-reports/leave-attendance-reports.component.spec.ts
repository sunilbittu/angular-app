import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveAttendanceReportsComponent } from './leave-attendance-reports.component';

describe('LeaveAttendanceReportsComponent', () => {
  let component: LeaveAttendanceReportsComponent;
  let fixture: ComponentFixture<LeaveAttendanceReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeaveAttendanceReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaveAttendanceReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
