import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncometaxSlabComponent } from './incometax-slab.component';

describe('IncometaxSlabComponent', () => {
  let component: IncometaxSlabComponent;
  let fixture: ComponentFixture<IncometaxSlabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncometaxSlabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncometaxSlabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
