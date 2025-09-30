import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeRelieveComponent } from './employee-relieve.component';

describe('EmployeeRelieveComponent', () => {
  let component: EmployeeRelieveComponent;
  let fixture: ComponentFixture<EmployeeRelieveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeRelieveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeRelieveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
