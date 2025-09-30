import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppraisalCycleCreationComponent } from './appraisal-cycle-creation.component';

describe('AppraisalCycleCreationComponent', () => {
  let component: AppraisalCycleCreationComponent;
  let fixture: ComponentFixture<AppraisalCycleCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppraisalCycleCreationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppraisalCycleCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
