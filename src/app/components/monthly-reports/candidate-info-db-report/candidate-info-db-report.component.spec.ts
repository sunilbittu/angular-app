import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateInfoDbReportComponent } from './candidate-info-db-report.component';

describe('CandidateInfoDbReportComponent', () => {
  let component: CandidateInfoDbReportComponent;
  let fixture: ComponentFixture<CandidateInfoDbReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CandidateInfoDbReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateInfoDbReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
