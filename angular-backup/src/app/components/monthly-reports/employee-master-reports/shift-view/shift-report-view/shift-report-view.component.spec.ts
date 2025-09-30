import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftReportViewComponent } from './shift-report-view.component';

describe('ShiftReportViewComponent', () => {
  let component: ShiftReportViewComponent;
  let fixture: ComponentFixture<ShiftReportViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShiftReportViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShiftReportViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
