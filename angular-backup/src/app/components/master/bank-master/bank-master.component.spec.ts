import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankMasterComponent } from './bank-master.component';

describe('BankMasterComponent', () => {
  let component: BankMasterComponent;
  let fixture: ComponentFixture<BankMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BankMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BankMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
