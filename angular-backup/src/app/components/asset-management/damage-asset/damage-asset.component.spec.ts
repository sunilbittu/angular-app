import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DamageAssetComponent } from './damage-asset.component';

describe('DamageAssetComponent', () => {
  let component: DamageAssetComponent;
  let fixture: ComponentFixture<DamageAssetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DamageAssetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DamageAssetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
