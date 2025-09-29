import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayslipComponentReportComponent } from './payslip-component-report.component';

describe('PayslipComponentReportComponent', () => {
  let component: PayslipComponentReportComponent;
  let fixture: ComponentFixture<PayslipComponentReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayslipComponentReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PayslipComponentReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
