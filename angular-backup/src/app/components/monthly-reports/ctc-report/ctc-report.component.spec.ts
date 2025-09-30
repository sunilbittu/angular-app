import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CtcReportComponent } from './ctc-report.component';

describe('CtcReportComponent', () => {
  let component: CtcReportComponent;
  let fixture: ComponentFixture<CtcReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CtcReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CtcReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
