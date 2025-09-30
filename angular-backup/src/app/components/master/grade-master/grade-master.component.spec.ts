import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GradeMasterComponent } from './grade-master.component';

describe('GradeMasterComponent', () => {
  let component: GradeMasterComponent;
  let fixture: ComponentFixture<GradeMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GradeMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GradeMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
