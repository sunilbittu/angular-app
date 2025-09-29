import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EPFSlabComponent } from './epf-slab.component';

describe('EPFSlabComponent', () => {
  let component: EPFSlabComponent;
  let fixture: ComponentFixture<EPFSlabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EPFSlabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EPFSlabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
