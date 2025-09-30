import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingExamResultsReportComponent } from './training-exam-results-report.component';

describe('TrainingExamResultsReportComponent', () => {
  let component: TrainingExamResultsReportComponent;
  let fixture: ComponentFixture<TrainingExamResultsReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrainingExamResultsReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainingExamResultsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
