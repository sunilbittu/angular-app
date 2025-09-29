import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitApplicationReportComponent } from './visit-application-report.component';

describe('VisitApplicationReportComponent', () => {
  let component: VisitApplicationReportComponent;
  let fixture: ComponentFixture<VisitApplicationReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisitApplicationReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitApplicationReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
