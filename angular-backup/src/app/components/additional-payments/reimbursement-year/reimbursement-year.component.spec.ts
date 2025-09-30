import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReimbursementYearComponent } from './reimbursement-year.component';

describe('ReimbursementYearComponent', () => {
  let component: ReimbursementYearComponent;
  let fixture: ComponentFixture<ReimbursementYearComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReimbursementYearComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReimbursementYearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
