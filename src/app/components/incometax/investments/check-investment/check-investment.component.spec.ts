import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckInvestmentComponent } from './check-investment.component';

describe('CheckInvestmentComponent', () => {
  let component: CheckInvestmentComponent;
  let fixture: ComponentFixture<CheckInvestmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckInvestmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckInvestmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
