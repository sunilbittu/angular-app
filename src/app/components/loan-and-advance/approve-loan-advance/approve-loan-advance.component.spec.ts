import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveLoanAdvanceComponent } from './approve-loan-advance.component';

describe('ApplyLoanAdvanceComponent', () => {
  let component: ApproveLoanAdvanceComponent;
  let fixture: ComponentFixture<ApproveLoanAdvanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApproveLoanAdvanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApproveLoanAdvanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
