import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignPunchLocationComponent } from './assign-punch-location.component';

describe('AssignPunchLocationComponent', () => {
  let component: AssignPunchLocationComponent;
  let fixture: ComponentFixture<AssignPunchLocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignPunchLocationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignPunchLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
