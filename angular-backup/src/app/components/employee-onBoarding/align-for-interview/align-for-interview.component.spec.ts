import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlignForInterviewComponent } from './align-for-interview.component';

describe('AlignForInterviewComponent', () => {
  let component: AlignForInterviewComponent;
  let fixture: ComponentFixture<AlignForInterviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlignForInterviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlignForInterviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
