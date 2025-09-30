import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaryOnholdComponent } from './salary-onhold.component';

describe('SalaryOnholdComponent', () => {
  let component: SalaryOnholdComponent;
  let fixture: ComponentFixture<SalaryOnholdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalaryOnholdComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalaryOnholdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
