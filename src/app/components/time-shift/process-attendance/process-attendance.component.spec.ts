import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessAttendanceComponent } from './process-attendance.component';

describe('ProcessAttendanceComponent', () => {
  let component: ProcessAttendanceComponent;
  let fixture: ComponentFixture<ProcessAttendanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcessAttendanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessAttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
