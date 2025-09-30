import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentHeadReviewComponent } from './department-head-review.component';

describe('DepartmentHeadReviewComponent', () => {
  let component: DepartmentHeadReviewComponent;
  let fixture: ComponentFixture<DepartmentHeadReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DepartmentHeadReviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DepartmentHeadReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
