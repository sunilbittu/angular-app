import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RewardsRecognitionReportComponent } from './rewards-recognition-report.component';

describe('RewardsRecognitionReportComponent', () => {
  let component: RewardsRecognitionReportComponent;
  let fixture: ComponentFixture<RewardsRecognitionReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RewardsRecognitionReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RewardsRecognitionReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
