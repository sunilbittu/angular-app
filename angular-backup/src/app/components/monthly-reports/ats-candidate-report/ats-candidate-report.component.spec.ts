import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AtsCandidateReportComponent } from './ats-candidate-report.component';

describe('AtsCandidateReportComponent', () => {
  let component: AtsCandidateReportComponent;
  let fixture: ComponentFixture<AtsCandidateReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AtsCandidateReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AtsCandidateReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
