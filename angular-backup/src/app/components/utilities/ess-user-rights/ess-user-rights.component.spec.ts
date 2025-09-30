import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EssUserRightsComponent } from './ess-user-rights.component';

describe('EssUserRightsComponent', () => {
  let component: EssUserRightsComponent;
  let fixture: ComponentFixture<EssUserRightsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EssUserRightsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EssUserRightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
