import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReimbursementReportsComponent } from './reimbursement-reports.component';

describe('ReimbursementReportsComponent', () => {
  let component: ReimbursementReportsComponent;
  let fixture: ComponentFixture<ReimbursementReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReimbursementReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReimbursementReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
