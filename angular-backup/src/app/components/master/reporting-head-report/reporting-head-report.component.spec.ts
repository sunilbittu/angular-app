import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportingHeadReportComponent } from './reporting-head-report.component';

describe('ReportingHeadReportComponent', () => {
  let component: ReportingHeadReportComponent;
  let fixture: ComponentFixture<ReportingHeadReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportingHeadReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportingHeadReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
