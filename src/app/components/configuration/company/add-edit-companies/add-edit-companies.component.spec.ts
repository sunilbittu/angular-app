import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditCompaniesComponent } from './add-edit-companies.component';

describe('AddEditCompaniesComponent', () => {
  let component: AddEditCompaniesComponent;
  let fixture: ComponentFixture<AddEditCompaniesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditCompaniesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditCompaniesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
