import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalWorkFlowComponent } from './approval-work-flow.component';

describe('ApprovalWorkFlowComponent', () => {
  let component: ApprovalWorkFlowComponent;
  let fixture: ComponentFixture<ApprovalWorkFlowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApprovalWorkFlowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovalWorkFlowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
