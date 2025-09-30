import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceCompanyMasterComponent } from './insurance-company-master.component';

describe('InsuranceCompanyMasterComponent', () => {
  let component: InsuranceCompanyMasterComponent;
  let fixture: ComponentFixture<InsuranceCompanyMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsuranceCompanyMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsuranceCompanyMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
