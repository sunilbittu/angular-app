import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RetriveAssetComponent } from './retrive-asset.component';

describe('DamageAssetComponent', () => {
  let component: RetriveAssetComponent;
  let fixture: ComponentFixture<RetriveAssetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RetriveAssetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RetriveAssetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
