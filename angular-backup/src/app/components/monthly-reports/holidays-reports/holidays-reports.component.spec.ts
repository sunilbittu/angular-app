import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HolidaysReportsComponent } from './holidays-reports.component';

describe('HolidaysReportsComponent', () => {
  let component: HolidaysReportsComponent;
  let fixture: ComponentFixture<HolidaysReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HolidaysReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HolidaysReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
