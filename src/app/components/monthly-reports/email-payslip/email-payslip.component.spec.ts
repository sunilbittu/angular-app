import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailPayslipComponent } from './email-payslip.component';

describe('EmailPayslipComponent', () => {
  let component: EmailPayslipComponent;
  let fixture: ComponentFixture<EmailPayslipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmailPayslipComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailPayslipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
