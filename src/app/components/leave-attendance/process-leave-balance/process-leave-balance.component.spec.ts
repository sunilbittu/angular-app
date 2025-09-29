import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessLeaveBalanceComponent } from './process-leave-balance.component';

describe('ProcessLeaveBalanceComponent', () => {
  let component: ProcessLeaveBalanceComponent;
  let fixture: ComponentFixture<ProcessLeaveBalanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcessLeaveBalanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessLeaveBalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
