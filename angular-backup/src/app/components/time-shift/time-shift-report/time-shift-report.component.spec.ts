import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeShiftReportComponent } from './time-shift-report.component';

describe('TimeShiftReportComponent', () => {
  let component: TimeShiftReportComponent;
  let fixture: ComponentFixture<TimeShiftReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimeShiftReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeShiftReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
