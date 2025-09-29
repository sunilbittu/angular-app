import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetCategoriesReportComponent } from './asset-categories-report.component';

describe('AssetCategoriesReportComponent', () => {
  let component: AssetCategoriesReportComponent;
  let fixture: ComponentFixture<AssetCategoriesReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetCategoriesReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetCategoriesReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
