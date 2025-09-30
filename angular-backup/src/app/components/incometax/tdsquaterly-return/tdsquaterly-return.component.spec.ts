import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TDSQuaterlyReturnComponent } from './tdsquaterly-return.component';

describe('TDSQuaterlyReturnComponent', () => {
  let component: TDSQuaterlyReturnComponent;
  let fixture: ComponentFixture<TDSQuaterlyReturnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TDSQuaterlyReturnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TDSQuaterlyReturnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
