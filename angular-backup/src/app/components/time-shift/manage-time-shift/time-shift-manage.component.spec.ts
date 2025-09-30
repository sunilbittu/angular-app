import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeShiftManageComponent } from './time-shift-manage.component';

describe('TimeShiftManageComponent', () => {
  let component: TimeShiftManageComponent;
  let fixture: ComponentFixture<TimeShiftManageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimeShiftManageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeShiftManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
