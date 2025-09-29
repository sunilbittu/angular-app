import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerGoalsReviewComponent } from './manager-goals-review.component';

describe('ManagerGoalsReviewComponent', () => {
  let component: ManagerGoalsReviewComponent;
  let fixture: ComponentFixture<ManagerGoalsReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManagerGoalsReviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerGoalsReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
