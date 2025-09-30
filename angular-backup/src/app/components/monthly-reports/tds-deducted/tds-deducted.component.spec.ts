import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TdsDeductedComponent } from './tds-deducted.component';

describe('TdsDeductedComponent', () => {
  let component: TdsDeductedComponent;
  let fixture: ComponentFixture<TdsDeductedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TdsDeductedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TdsDeductedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
