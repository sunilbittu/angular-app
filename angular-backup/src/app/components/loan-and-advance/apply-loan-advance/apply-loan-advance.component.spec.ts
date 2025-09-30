import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplyLoanAdvanceComponent } from './apply-loan-advance.component';

describe('ApplyLoanAdvanceComponent', () => {
  let component: ApplyLoanAdvanceComponent;
  let fixture: ComponentFixture<ApplyLoanAdvanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplyLoanAdvanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplyLoanAdvanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
