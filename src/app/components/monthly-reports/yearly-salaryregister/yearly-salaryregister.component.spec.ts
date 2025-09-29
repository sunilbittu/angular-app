import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YearlySalaryregisterComponent } from './yearly-salaryregister.component';

describe('YearlySalaryregisterComponent', () => {
  let component: YearlySalaryregisterComponent;
  let fixture: ComponentFixture<YearlySalaryregisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YearlySalaryregisterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(YearlySalaryregisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
