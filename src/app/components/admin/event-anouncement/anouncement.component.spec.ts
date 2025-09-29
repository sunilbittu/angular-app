import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventAnouncementComponent } from './anouncement.component';

describe('EventAnouncementComponent', () => {
  let component: EventAnouncementComponent;
  let fixture: ComponentFixture<EventAnouncementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventAnouncementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventAnouncementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
