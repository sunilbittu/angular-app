import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpdeskReportComponent } from './helpdesk-report.component';

describe('HelpdeskReportComponent', () => {
  let component: HelpdeskReportComponent;
  let fixture: ComponentFixture<HelpdeskReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HelpdeskReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpdeskReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
