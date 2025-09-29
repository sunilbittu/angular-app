import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisbursementPayymentComponent } from './disbursement-payyment.component';

describe('DisbursementPayymentComponent', () => {
  let component: DisbursementPayymentComponent;
  let fixture: ComponentFixture<DisbursementPayymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisbursementPayymentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DisbursementPayymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
