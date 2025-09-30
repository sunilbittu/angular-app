import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftAssignedComponent } from './shift-assigned.component';

describe('ShiftAssignedComponent', () => {
  let component: ShiftAssignedComponent;
  let fixture: ComponentFixture<ShiftAssignedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShiftAssignedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShiftAssignedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
