import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestmentTableComponent } from './investment-table.component';

describe('InvestmentTableComponent', () => {
  let component: InvestmentTableComponent;
  let fixture: ComponentFixture<InvestmentTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvestmentTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvestmentTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
