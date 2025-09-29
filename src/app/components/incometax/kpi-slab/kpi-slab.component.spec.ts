import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KPISlabComponent } from './kpi-slab.component';

describe('KPISlabComponent', () => {
  let component: KPISlabComponent;
  let fixture: ComponentFixture<KPISlabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KPISlabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KPISlabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
