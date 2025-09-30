import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeAppraisalComponent } from './employee-appraisal.component';

describe('EmployeeAppraisalComponent', () => {
  let component: EmployeeAppraisalComponent;
  let fixture: ComponentFixture<EmployeeAppraisalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeAppraisalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeAppraisalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
