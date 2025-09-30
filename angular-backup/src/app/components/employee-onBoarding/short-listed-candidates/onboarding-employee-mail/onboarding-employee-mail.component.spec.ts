import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardingEmployeeMailComponent } from './onboarding-employee-mail.component';

describe('OnboardingEmployeeMailComponent', () => {
  let component: OnboardingEmployeeMailComponent;
  let fixture: ComponentFixture<OnboardingEmployeeMailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnboardingEmployeeMailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OnboardingEmployeeMailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
