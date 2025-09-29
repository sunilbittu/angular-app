import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeTenureReportsComponent } from './employee-tenure-reports.component';

describe('EmployeeTenureReportsComponent', () => {
  let component: EmployeeTenureReportsComponent;
  let fixture: ComponentFixture<EmployeeTenureReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeTenureReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeTenureReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
