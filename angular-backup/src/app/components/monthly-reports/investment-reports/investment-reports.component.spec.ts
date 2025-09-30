import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestmentReportsComponent } from './investment-reports.component';

describe('InvestmentReportsComponent', () => {
  let component: InvestmentReportsComponent;
  let fixture: ComponentFixture<InvestmentReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvestmentReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvestmentReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
