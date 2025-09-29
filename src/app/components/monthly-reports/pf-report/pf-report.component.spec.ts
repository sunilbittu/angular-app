import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PfReportComponent } from './pf-report.component';

describe('PfReportComponent', () => {
  let component: PfReportComponent;
  let fixture: ComponentFixture<PfReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PfReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PfReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
