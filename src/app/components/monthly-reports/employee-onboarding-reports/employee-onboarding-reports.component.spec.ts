import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeOnboardingReportsComponent } from './employee-onboarding-reports.component';

describe('EmployeeOnboardingReportsComponent', () => {
  let component: EmployeeOnboardingReportsComponent;
  let fixture: ComponentFixture<EmployeeOnboardingReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeOnboardingReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeOnboardingReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
