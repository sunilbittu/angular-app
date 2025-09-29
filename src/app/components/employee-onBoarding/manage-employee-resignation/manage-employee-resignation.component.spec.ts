import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageEmployeeResignationComponent } from './manage-employee-resignation.component';

describe('EmployeeResignationComponent', () => {
  let component: ManageEmployeeResignationComponent;
  let fixture: ComponentFixture<ManageEmployeeResignationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageEmployeeResignationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageEmployeeResignationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
