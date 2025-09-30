import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorAssetReportComponent } from './vendor-asset-report.component';

describe('VendorAssetReportComponent', () => {
  let component: VendorAssetReportComponent;
  let fixture: ComponentFixture<VendorAssetReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorAssetReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorAssetReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
