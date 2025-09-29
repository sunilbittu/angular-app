import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveMappingComponent } from './leave-mapping.component';

describe('LeaveMappingComponent', () => {
  let component: LeaveMappingComponent;
  let fixture: ComponentFixture<LeaveMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeaveMappingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaveMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
