import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateManageExpensesTypeComponent } from './create-manage-expenses-type.component';

describe('CreateManageExpensesTypeComponent', () => {
  let component: CreateManageExpensesTypeComponent;
  let fixture: ComponentFixture<CreateManageExpensesTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateManageExpensesTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateManageExpensesTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
