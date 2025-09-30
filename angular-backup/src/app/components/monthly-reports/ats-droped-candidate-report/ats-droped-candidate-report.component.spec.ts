import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AtsDropedCandidateReportComponent } from './ats-droped-candidate-report.component';

describe('AtsDropedCandidateReportComponent', () => {
  let component: AtsDropedCandidateReportComponent;
  let fixture: ComponentFixture<AtsDropedCandidateReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AtsDropedCandidateReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AtsDropedCandidateReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
