import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaryMappingComponent } from './salary-mapping.component';

describe('SalaryMappingComponent', () => {
  let component: SalaryMappingComponent;
  let fixture: ComponentFixture<SalaryMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalaryMappingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalaryMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
