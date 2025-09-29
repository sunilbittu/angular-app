import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplementaryPaymentComponent } from './supplementary-payment.component';

describe('SupplementaryPaymentComponent', () => {
  let component: SupplementaryPaymentComponent;
  let fixture: ComponentFixture<SupplementaryPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupplementaryPaymentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplementaryPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
