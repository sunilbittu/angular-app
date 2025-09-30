import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EssRoleAssignComponent } from './ess-role-assign.component';

describe('EssRoleAssignComponent', () => {
  let component: EssRoleAssignComponent;
  let fixture: ComponentFixture<EssRoleAssignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EssRoleAssignComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EssRoleAssignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
