import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageResultsAssesmentComponent } from './manage-results-assesment.component';

describe('ManageResultsAssesmentComponent', () => {
  let component: ManageResultsAssesmentComponent;
  let fixture: ComponentFixture<ManageResultsAssesmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageResultsAssesmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageResultsAssesmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
