import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeModelPopupComponent } from './employee-model-popup.component';

describe('EmployeeModelPopupComponent', () => {
  let component: EmployeeModelPopupComponent;
  let fixture: ComponentFixture<EmployeeModelPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeModelPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeModelPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
