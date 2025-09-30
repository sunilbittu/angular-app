import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletePayslipComponent } from './payslip.component';

describe('DeletePayslipComponent', () => {
  let component: DeletePayslipComponent;
  let fixture: ComponentFixture<DeletePayslipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeletePayslipComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeletePayslipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
