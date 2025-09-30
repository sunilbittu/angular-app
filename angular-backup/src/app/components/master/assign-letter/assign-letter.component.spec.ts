import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignLetterComponent } from './assign-letter.component';

describe('AssignLetterComponent', () => {
  let component: AssignLetterComponent;
  let fixture: ComponentFixture<AssignLetterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignLetterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
