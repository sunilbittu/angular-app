import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeRejoinComponent } from './employee-rejoin.component';

describe('EmployeeRejoinComponent', () => {
  let component: EmployeeRejoinComponent;
  let fixture: ComponentFixture<EmployeeRejoinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeRejoinComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeRejoinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
