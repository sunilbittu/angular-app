import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerReviewMenuComponent } from './manager-review-menu.component';

describe('ManagerReviewMenuComponent', () => {
  let component: ManagerReviewMenuComponent;
  let fixture: ComponentFixture<ManagerReviewMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManagerReviewMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerReviewMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
