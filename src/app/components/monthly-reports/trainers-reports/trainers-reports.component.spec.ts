import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainersReportsComponent } from './trainers-reports.component';

describe('TrainersReportsComponent', () => {
  let component: TrainersReportsComponent;
  let fixture: ComponentFixture<TrainersReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrainersReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainersReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
