import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BonusCalculationComponent } from './bonus-calculation.component';

describe('BonusCalculationComponent', () => {
  let component: BonusCalculationComponent;
  let fixture: ComponentFixture<BonusCalculationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BonusCalculationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BonusCalculationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
