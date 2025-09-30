import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageRewardsAndRecognizationComponent } from './manage-rewards-and-recognization.component';

describe('ManageRewardsAndRecognizationComponent', () => {
  let component: ManageRewardsAndRecognizationComponent;
  let fixture: ComponentFixture<ManageRewardsAndRecognizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageRewardsAndRecognizationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageRewardsAndRecognizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
