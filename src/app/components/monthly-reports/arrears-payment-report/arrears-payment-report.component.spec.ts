import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArrearsPaymentReportComponent } from './arrears-payment-report.component';

describe('ArrearsPaymentReportComponent', () => {
  let component: ArrearsPaymentReportComponent;
  let fixture: ComponentFixture<ArrearsPaymentReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArrearsPaymentReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArrearsPaymentReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
