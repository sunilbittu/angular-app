import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportReimbursmentBillComponent } from './import-reimbursment-bill.component';

describe('ImportReimbursmentBillComponent', () => {
  let component: ImportReimbursmentBillComponent;
  let fixture: ComponentFixture<ImportReimbursmentBillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportReimbursmentBillComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportReimbursmentBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
