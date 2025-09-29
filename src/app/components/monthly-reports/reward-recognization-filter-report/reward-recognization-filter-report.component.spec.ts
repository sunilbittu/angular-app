import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RewardRecognizationFilterReportComponent } from './reward-recognization-filter-report.component';

describe('RewardRecognizationFilterReportComponent', () => {
  let component: RewardRecognizationFilterReportComponent;
  let fixture: ComponentFixture<RewardRecognizationFilterReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RewardRecognizationFilterReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RewardRecognizationFilterReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
