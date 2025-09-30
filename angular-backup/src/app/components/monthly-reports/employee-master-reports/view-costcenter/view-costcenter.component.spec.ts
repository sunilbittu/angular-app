import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCostcenterComponent } from './view-costcenter.component';

describe('ViewCostcenterComponent', () => {
  let component: ViewCostcenterComponent;
  let fixture: ComponentFixture<ViewCostcenterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewCostcenterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCostcenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
