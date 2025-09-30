import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveAssetManagemntComponent } from './approve-asset-managemnt.component';

describe('ApproveAssetManagemntComponent', () => {
  let component: ApproveAssetManagemntComponent;
  let fixture: ComponentFixture<ApproveAssetManagemntComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApproveAssetManagemntComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApproveAssetManagemntComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
