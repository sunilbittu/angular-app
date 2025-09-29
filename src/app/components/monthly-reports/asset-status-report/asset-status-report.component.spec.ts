import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetStatusReportComponent } from './asset-status-report.component';

describe('AssetStatusReportComponent', () => {
  let component: AssetStatusReportComponent;
  let fixture: ComponentFixture<AssetStatusReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetStatusReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetStatusReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
