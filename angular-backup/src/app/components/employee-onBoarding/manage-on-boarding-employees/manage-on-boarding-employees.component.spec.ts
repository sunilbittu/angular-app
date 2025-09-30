import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageOnBoardingEmployeesComponent } from './manage-on-boarding-employees.component';

describe('ManageOnBoardingEmployeesComponent', () => {
  let component: ManageOnBoardingEmployeesComponent;
  let fixture: ComponentFixture<ManageOnBoardingEmployeesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageOnBoardingEmployeesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageOnBoardingEmployeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
