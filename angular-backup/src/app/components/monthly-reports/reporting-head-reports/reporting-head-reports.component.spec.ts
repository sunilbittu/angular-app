import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportingHeadReportsComponent } from './reporting-head-reports.component';

describe('ReportingHeadReportsComponent', () => {
  let component: ReportingHeadReportsComponent;
  let fixture: ComponentFixture<ReportingHeadReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportingHeadReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportingHeadReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
