import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HrTeamAppraisalStatusComponent } from './hr-team-appraisal-status.component';

describe('HrTeamAppraisalStatusComponent', () => {
  let component: HrTeamAppraisalStatusComponent;
  let fixture: ComponentFixture<HrTeamAppraisalStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HrTeamAppraisalStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HrTeamAppraisalStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
