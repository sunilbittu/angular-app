import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportProcessedSalaryComponent } from './import-processed-salary.component';

describe('ImportProcessedSalaryComponent', () => {
  let component: ImportProcessedSalaryComponent;
  let fixture: ComponentFixture<ImportProcessedSalaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportProcessedSalaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportProcessedSalaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
