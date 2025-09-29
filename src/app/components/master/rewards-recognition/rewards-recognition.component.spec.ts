import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RewardsRecognitionComponent } from './rewards-recognition.component';

describe('RewardsRecognitionComponent', () => {
  let component: RewardsRecognitionComponent;
  let fixture: ComponentFixture<RewardsRecognitionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RewardsRecognitionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RewardsRecognitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
