import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTdsDetailsComponent } from './view-tds-details.component';

describe('ViewTdsDetailsComponent', () => {
  let component: ViewTdsDetailsComponent;
  let fixture: ComponentFixture<ViewTdsDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewTdsDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewTdsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
