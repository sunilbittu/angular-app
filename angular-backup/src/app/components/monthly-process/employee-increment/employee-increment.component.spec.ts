import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeIncrementComponent } from './employee-increment.component';

describe('EmployeeIncrementComponent', () => {
  let component: EmployeeIncrementComponent;
  let fixture: ComponentFixture<EmployeeIncrementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeIncrementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeIncrementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
