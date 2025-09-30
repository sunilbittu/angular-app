import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GratuityCalculationComponent } from './gratuity-calculation.component';

describe('GratuityCalculationComponent', () => {
  let component: GratuityCalculationComponent;
  let fixture: ComponentFixture<GratuityCalculationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GratuityCalculationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GratuityCalculationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
