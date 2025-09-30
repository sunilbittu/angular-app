import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendanceTimeSheetComponent } from './attendance-time-sheet.component';

describe('AttendanceTimeSheetComponent', () => {
  let component: AttendanceTimeSheetComponent;
  let fixture: ComponentFixture<AttendanceTimeSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttendanceTimeSheetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AttendanceTimeSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
