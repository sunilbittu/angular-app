import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanAdvanceComponent } from './loan-advance.component';

describe('LoanAdvanceComponent', () => {
  let component: LoanAdvanceComponent;
  let fixture: ComponentFixture<LoanAdvanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoanAdvanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanAdvanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
