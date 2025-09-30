import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonEmployeeFilterComponent } from './common-employee-filter.component';

describe('CommonEmployeeFilterComponent', () => {
  let component: CommonEmployeeFilterComponent;
  let fixture: ComponentFixture<CommonEmployeeFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommonEmployeeFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonEmployeeFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
