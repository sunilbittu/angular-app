import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodaysLeaveEmployeeComponent } from './todays-leave-employee.component';

describe('TodaysLeaveEmployeeComponent', () => {
  let component: TodaysLeaveEmployeeComponent;
  let fixture: ComponentFixture<TodaysLeaveEmployeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TodaysLeaveEmployeeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TodaysLeaveEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
