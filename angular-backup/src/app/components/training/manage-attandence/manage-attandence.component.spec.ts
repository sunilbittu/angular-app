import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageAttandenceComponent } from './manage-attandence.component';

describe('ManageTrainingComponent', () => {
  let component: ManageAttandenceComponent;
  let fixture: ComponentFixture<ManageAttandenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageAttandenceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageAttandenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
