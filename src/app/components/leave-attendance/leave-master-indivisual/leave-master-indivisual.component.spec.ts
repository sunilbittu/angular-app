import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveMasterIndivisualComponent } from './leave-master-indivisual.component';

describe('LeaveMasterIndivisualComponent', () => {
  let component: LeaveMasterIndivisualComponent;
  let fixture: ComponentFixture<LeaveMasterIndivisualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeaveMasterIndivisualComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaveMasterIndivisualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
