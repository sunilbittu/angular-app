import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyClosingBalanceComponent } from './monthly-closing-balance.component';

describe('MonthlyClosingBalanceComponent', () => {
  let component: MonthlyClosingBalanceComponent;
  let fixture: ComponentFixture<MonthlyClosingBalanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonthlyClosingBalanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthlyClosingBalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
