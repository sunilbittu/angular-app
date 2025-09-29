import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeMasterReportsComponent } from './employee-master-reports.component';

describe('EmployeeMasterReportsComponent', () => {
  let component: EmployeeMasterReportsComponent;
  let fixture: ComponentFixture<EmployeeMasterReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeMasterReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeMasterReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
