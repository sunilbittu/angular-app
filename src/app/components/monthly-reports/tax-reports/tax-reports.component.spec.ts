import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxReportsComponent } from './tax-reports.component';

describe('TaxReportsComponent', () => {
  let component: TaxReportsComponent;
  let fixture: ComponentFixture<TaxReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaxReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaxReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
