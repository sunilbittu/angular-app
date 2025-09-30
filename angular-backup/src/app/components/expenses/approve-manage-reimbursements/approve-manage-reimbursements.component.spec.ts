import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveManageReimbursementsComponent } from './approve-manage-reimbursements.component';

describe('ApplyManageReimbursementsComponent', () => {
  let component: ApproveManageReimbursementsComponent;
  let fixture: ComponentFixture<ApproveManageReimbursementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApproveManageReimbursementsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApproveManageReimbursementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
