import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeShiftMappingComponent } from './time-shift-mapping.component';

describe('TimeShiftMappingComponent', () => {
  let component: TimeShiftMappingComponent;
  let fixture: ComponentFixture<TimeShiftMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimeShiftMappingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeShiftMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
