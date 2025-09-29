import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EISSlabComponent } from './eis-slab.component';

describe('EISSlabComponent', () => {
  let component: EISSlabComponent;
  let fixture: ComponentFixture<EISSlabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EISSlabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EISSlabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
