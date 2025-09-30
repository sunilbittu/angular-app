import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerReviewScreenComponent } from './manager-review-screen.component';

describe('ManagerReviewScreenComponent', () => {
  let component: ManagerReviewScreenComponent;
  let fixture: ComponentFixture<ManagerReviewScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManagerReviewScreenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerReviewScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
