import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HiringPerformanceComponent } from './hiring-performance.component';

describe('HiringPerformanceComponent', () => {
  let component: HiringPerformanceComponent;
  let fixture: ComponentFixture<HiringPerformanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HiringPerformanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HiringPerformanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
