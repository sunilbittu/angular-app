import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventMappingComponent } from './qualification-master.component';

describe('EventMappingComponent', () => {
  let component: EventMappingComponent;
  let fixture: ComponentFixture<EventMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventMappingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
