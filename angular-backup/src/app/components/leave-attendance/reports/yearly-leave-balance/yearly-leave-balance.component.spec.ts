import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YearlyLeaveBalanceComponent } from './yearly-leave-balance.component';

describe('YearlyLeaveBalanceComponent', () => {
  let component: YearlyLeaveBalanceComponent;
  let fixture: ComponentFixture<YearlyLeaveBalanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YearlyLeaveBalanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(YearlyLeaveBalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
