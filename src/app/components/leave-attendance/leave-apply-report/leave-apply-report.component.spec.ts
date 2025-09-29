import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveApplyReportComponent } from './leave-apply-report.component';

describe('LeaveApplyReportComponent', () => {
  let component: LeaveApplyReportComponent;
  let fixture: ComponentFixture<LeaveApplyReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeaveApplyReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaveApplyReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
