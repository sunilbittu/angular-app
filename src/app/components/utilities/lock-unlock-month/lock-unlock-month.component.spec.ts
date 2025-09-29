import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LockUnlockMonthComponent } from './lock-unlock-month.component';

describe('LockUnlockMonthComponent', () => {
  let component: LockUnlockMonthComponent;
  let fixture: ComponentFixture<LockUnlockMonthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LockUnlockMonthComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LockUnlockMonthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
