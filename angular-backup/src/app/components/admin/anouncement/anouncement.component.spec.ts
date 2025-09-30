import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnouncementComponent } from './anouncement.component';

describe('AnouncementComponent', () => {
  let component: AnouncementComponent;
  let fixture: ComponentFixture<AnouncementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnouncementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnouncementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
