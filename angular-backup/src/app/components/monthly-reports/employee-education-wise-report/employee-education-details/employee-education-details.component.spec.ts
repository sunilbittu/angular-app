import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeEducationDetailsComponent } from './employee-education-details.component';

describe('EmployeeEducationDetailsComponent', () => {
  let component: EmployeeEducationDetailsComponent;
  let fixture: ComponentFixture<EmployeeEducationDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeEducationDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeEducationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
