import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AtsJobsComponent } from './ats-jobs.component';

describe('AtsJobsComponent', () => {
  let component: AtsJobsComponent;
  let fixture: ComponentFixture<AtsJobsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AtsJobsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AtsJobsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
