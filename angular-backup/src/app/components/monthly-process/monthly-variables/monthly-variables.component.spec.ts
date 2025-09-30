import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyVariablesComponent } from './monthly-variables.component';

describe('MonthlyVariablesComponent', () => {
  let component: MonthlyVariablesComponent;
  let fixture: ComponentFixture<MonthlyVariablesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonthlyVariablesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthlyVariablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
