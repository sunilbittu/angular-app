import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FundsRealizedComponent } from './funds-realized.component';

describe('FundsRealizedComponent', () => {
  let component: FundsRealizedComponent;
  let fixture: ComponentFixture<FundsRealizedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FundsRealizedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FundsRealizedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
