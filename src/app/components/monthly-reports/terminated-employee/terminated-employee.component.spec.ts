import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminatedEmployeeComponent } from './terminated-employee.component';

describe('TerminatedEmployeeComponent', () => {
  let component: TerminatedEmployeeComponent;
  let fixture: ComponentFixture<TerminatedEmployeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TerminatedEmployeeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TerminatedEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
