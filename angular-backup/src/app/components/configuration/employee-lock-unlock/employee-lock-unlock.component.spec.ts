import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeLockUnlockComponent } from './employee-lock-unlock.component';

describe('EmployeeLockUnlockComponent', () => {
  let component: EmployeeLockUnlockComponent;
  let fixture: ComponentFixture<EmployeeLockUnlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeLockUnlockComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeLockUnlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
