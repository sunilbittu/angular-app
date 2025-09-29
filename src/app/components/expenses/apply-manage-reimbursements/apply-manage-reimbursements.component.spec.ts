import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplyManageReimbursementsComponent } from './apply-manage-reimbursements.component';

describe('ApplyManageReimbursementsComponent', () => {
  let component: ApplyManageReimbursementsComponent;
  let fixture: ComponentFixture<ApplyManageReimbursementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplyManageReimbursementsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplyManageReimbursementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
