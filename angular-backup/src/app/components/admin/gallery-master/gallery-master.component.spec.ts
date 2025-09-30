import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GalleryMasterComponent } from './gallery-master.component';

describe('GalleryMasterComponent', () => {
  let component: GalleryMasterComponent;
  let fixture: ComponentFixture<GalleryMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GalleryMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GalleryMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
