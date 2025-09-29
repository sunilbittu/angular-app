import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaryIncrementArrearsPaymentComponent } from './salary-increment-arrears-payment.component';

describe('SalaryIncrementArrearsPaymentComponent', () => {
  let component: SalaryIncrementArrearsPaymentComponent;
  let fixture: ComponentFixture<SalaryIncrementArrearsPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalaryIncrementArrearsPaymentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalaryIncrementArrearsPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
