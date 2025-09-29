import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReimbursementBillpaymentComponent } from './reimbursement-billpayment.component';

describe('ReimbursementBillpaymentComponent', () => {
  let component: ReimbursementBillpaymentComponent;
  let fixture: ComponentFixture<ReimbursementBillpaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReimbursementBillpaymentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReimbursementBillpaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
