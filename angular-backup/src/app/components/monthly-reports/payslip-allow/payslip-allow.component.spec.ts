import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayslipAllowComponent } from './payslip-allow.component';

describe('PayslipComponent', () => {
  let component: PayslipAllowComponent;
  let fixture: ComponentFixture<PayslipAllowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayslipAllowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PayslipAllowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
