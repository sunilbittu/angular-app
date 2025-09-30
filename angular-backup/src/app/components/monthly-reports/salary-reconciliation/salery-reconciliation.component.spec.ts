import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleryReconciliationComponent } from './salery-reconciliation.component';

describe('SaleryReconciliationComponent', () => {
  let component: SaleryReconciliationComponent;
  let fixture: ComponentFixture<SaleryReconciliationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaleryReconciliationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleryReconciliationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
