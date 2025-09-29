import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplyAssetManagemntComponent } from './apply-asset-managemnt.component';

describe('ApplyAssetManagemntComponent', () => {
  let component: ApplyAssetManagemntComponent;
  let fixture: ComponentFixture<ApplyAssetManagemntComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplyAssetManagemntComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplyAssetManagemntComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
