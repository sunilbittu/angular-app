import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetIssuesComponent } from './asset-issues.component';

describe('AssetIssuesComponent', () => {
  let component: AssetIssuesComponent;
  let fixture: ComponentFixture<AssetIssuesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetIssuesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetIssuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
