import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EssUserComponent } from './ess-user.component';

describe('EssUserComponent', () => {
  let component: EssUserComponent;
  let fixture: ComponentFixture<EssUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EssUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EssUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
