import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationHierarchyReportsComponent } from './organization-hierarchy-reports.component';

describe('OrganizationHierarchyReportsComponent', () => {
  let component: OrganizationHierarchyReportsComponent;
  let fixture: ComponentFixture<OrganizationHierarchyReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrganizationHierarchyReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationHierarchyReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
