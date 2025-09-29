import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BenchResourceMappingComponent } from './bench-resource-mapping.component';

describe('BenchResourceMappingComponent', () => {
  let component: BenchResourceMappingComponent;
  let fixture: ComponentFixture<BenchResourceMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BenchResourceMappingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BenchResourceMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
