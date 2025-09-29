import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignReportingHeadComponent } from './assign-reporting-head.component';

describe('AssignReportingHeadComponent', () => {
  let component: AssignReportingHeadComponent;
  let fixture: ComponentFixture<AssignReportingHeadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignReportingHeadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignReportingHeadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
