import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveRewardsAndRecognizationComponent } from './approve-rewards-and-recognization.component';

describe('ManageRewardsAndRecognizationComponent', () => {
  let component: ApproveRewardsAndRecognizationComponent;
  let fixture: ComponentFixture<ApproveRewardsAndRecognizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApproveRewardsAndRecognizationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApproveRewardsAndRecognizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
