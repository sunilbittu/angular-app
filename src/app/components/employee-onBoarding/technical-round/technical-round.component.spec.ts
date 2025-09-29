import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnicalRoundComponent } from './technical-round.component';

describe('TechnicalRoundComponent', () => {
  let component: TechnicalRoundComponent;
  let fixture: ComponentFixture<TechnicalRoundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TechnicalRoundComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TechnicalRoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
