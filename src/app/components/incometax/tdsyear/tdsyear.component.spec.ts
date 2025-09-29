import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TDSYearComponent } from './tdsyear.component';

describe('TDSYearComponent', () => {
  let component: TDSYearComponent;
  let fixture: ComponentFixture<TDSYearComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TDSYearComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TDSYearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
