import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferralRecruitmentComponent } from './referral-recruitment.component';

describe('ReferralRecruitmentComponent', () => {
  let component: ReferralRecruitmentComponent;
  let fixture: ComponentFixture<ReferralRecruitmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReferralRecruitmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferralRecruitmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
