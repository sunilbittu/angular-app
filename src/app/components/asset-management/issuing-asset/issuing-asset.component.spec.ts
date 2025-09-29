import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssuingAssetComponent } from './issuing-asset.component';

describe('IssueAssetComponent', () => {
  let component: IssuingAssetComponent;
  let fixture: ComponentFixture<IssuingAssetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IssuingAssetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IssuingAssetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
