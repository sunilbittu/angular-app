import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardingEmployeeComponent } from './onboarding-employee.component';

describe('OnboardingEmployeeComponent', () => {
  let component: OnboardingEmployeeComponent;
  let fixture: ComponentFixture<OnboardingEmployeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnboardingEmployeeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OnboardingEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
