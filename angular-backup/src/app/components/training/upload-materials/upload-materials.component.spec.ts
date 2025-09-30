import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadMaterialsComponent } from './upload-materials.component';

describe('UploadMaterialsComponent', () => {
  let component: UploadMaterialsComponent;
  let fixture: ComponentFixture<UploadMaterialsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadMaterialsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadMaterialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
