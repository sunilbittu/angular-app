import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateLeaveYearComponent } from './create-leave-year.component';

describe('CreateLeaveYearComponent', () => {
  let component: CreateLeaveYearComponent;
  let fixture: ComponentFixture<CreateLeaveYearComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateLeaveYearComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateLeaveYearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
