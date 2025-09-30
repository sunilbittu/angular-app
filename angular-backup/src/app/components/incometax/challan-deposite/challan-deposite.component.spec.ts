import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChallanDepositeComponent } from './challan-deposite.component';

describe('ChallanDepositeComponent', () => {
  let component: ChallanDepositeComponent;
  let fixture: ComponentFixture<ChallanDepositeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChallanDepositeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChallanDepositeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
