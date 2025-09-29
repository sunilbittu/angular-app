import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaryIncrementReportComponent } from './salary-increment-report.component';

describe('SalaryIncrementReportComponent', () => {
  let component: SalaryIncrementReportComponent;
  let fixture: ComponentFixture<SalaryIncrementReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalaryIncrementReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalaryIncrementReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
