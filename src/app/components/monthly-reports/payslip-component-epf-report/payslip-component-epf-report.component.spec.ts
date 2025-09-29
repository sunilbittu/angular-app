import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayslipComponentEpfReportComponent } from './payslip-component-epf-report.component';

describe('PayslipComponentEpfReportComponent', () => {
  let component: PayslipComponentEpfReportComponent;
  let fixture: ComponentFixture<PayslipComponentEpfReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayslipComponentEpfReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PayslipComponentEpfReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
