import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TdsInvestmentComponent } from './tds-investment.component';

describe('TdsInvestmentComponent', () => {
  let component: TdsInvestmentComponent;
  let fixture: ComponentFixture<TdsInvestmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TdsInvestmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TdsInvestmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
