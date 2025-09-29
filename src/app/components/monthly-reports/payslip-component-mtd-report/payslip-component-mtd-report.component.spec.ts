import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayslipComponentMtdReportComponent } from './payslip-component-mtd-report.component';

describe('PayslipComponentMtdReportComponent', () => {
  let component: PayslipComponentMtdReportComponent;
  let fixture: ComponentFixture<PayslipComponentMtdReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayslipComponentMtdReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PayslipComponentMtdReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
