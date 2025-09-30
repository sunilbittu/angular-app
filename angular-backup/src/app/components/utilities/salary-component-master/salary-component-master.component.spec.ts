import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaryComponentMasterComponent } from './salary-component-master.component';

describe('SalaryComponentMasterComponent', () => {
  let component: SalaryComponentMasterComponent;
  let fixture: ComponentFixture<SalaryComponentMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalaryComponentMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalaryComponentMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
