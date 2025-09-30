import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddChallanComponent } from './add-challan.component';

describe('AddChallanComponent', () => {
  let component: AddChallanComponent;
  let fixture: ComponentFixture<AddChallanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddChallanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddChallanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
