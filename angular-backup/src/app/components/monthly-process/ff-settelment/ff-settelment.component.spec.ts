import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FfSettelmentComponent } from './ff-settelment.component';

describe('FfSettelmentComponent', () => {
  let component: FfSettelmentComponent;
  let fixture: ComponentFixture<FfSettelmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FfSettelmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FfSettelmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
