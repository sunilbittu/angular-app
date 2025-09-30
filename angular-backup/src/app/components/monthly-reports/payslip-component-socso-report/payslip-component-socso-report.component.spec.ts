import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayslipComponentSocsoReportComponent } from './payslip-component-socso-report.component';

describe('PayslipComponentSocsoReportComponent', () => {
  let component: PayslipComponentSocsoReportComponent;
  let fixture: ComponentFixture<PayslipComponentSocsoReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayslipComponentSocsoReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PayslipComponentSocsoReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
