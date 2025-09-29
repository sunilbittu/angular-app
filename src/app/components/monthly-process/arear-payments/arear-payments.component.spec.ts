import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArearPaymentsComponent } from './arear-payments.component';

describe('ArearPaymentsComponent', () => {
  let component: ArearPaymentsComponent;
  let fixture: ComponentFixture<ArearPaymentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArearPaymentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArearPaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
