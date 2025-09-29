import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyLeaveBalanceComponent } from './monthly-leave-balance.component';

describe('MonthlyLeaveBalanceComponent', () => {
  let component: MonthlyLeaveBalanceComponent;
  let fixture: ComponentFixture<MonthlyLeaveBalanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonthlyLeaveBalanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthlyLeaveBalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
