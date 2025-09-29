import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlabMasterComponent } from './slab-master.component';

describe('SlabMasterComponent', () => {
  let component: SlabMasterComponent;
  let fixture: ComponentFixture<SlabMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SlabMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SlabMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
