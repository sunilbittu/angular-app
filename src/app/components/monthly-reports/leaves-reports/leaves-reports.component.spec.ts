import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeavesReportsComponent } from './leaves-reports.component';

describe('LeavesReportsComponent', () => {
  let component: LeavesReportsComponent;
  let fixture: ComponentFixture<LeavesReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeavesReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeavesReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
