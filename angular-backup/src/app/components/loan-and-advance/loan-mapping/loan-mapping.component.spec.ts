import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanMappingComponent } from './loan-mapping.component';

describe('LoanMappingComponent', () => {
  let component: LoanMappingComponent;
  let fixture: ComponentFixture<LoanMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoanMappingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
