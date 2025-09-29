import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReimbursementOpeningComponent } from './reimbursement-opening.component';

describe('ReimbursementOpeningComponent', () => {
  let component: ReimbursementOpeningComponent;
  let fixture: ComponentFixture<ReimbursementOpeningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReimbursementOpeningComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReimbursementOpeningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
