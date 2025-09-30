import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestProcessingComponent } from './request-processing.component';

describe('RequestProcessingComponent', () => {
  let component: RequestProcessingComponent;
  let fixture: ComponentFixture<RequestProcessingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestProcessingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestProcessingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
