import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SOCSOSlabComponent } from './socso-slab.component';

describe('SOCSOSlabComponent', () => {
  let component: SOCSOSlabComponent;
  let fixture: ComponentFixture<SOCSOSlabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SOCSOSlabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SOCSOSlabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
