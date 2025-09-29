import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PassportDlComponent } from './passport-dl.component';

describe('PassportDlComponent', () => {
  let component: PassportDlComponent;
  let fixture: ComponentFixture<PassportDlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PassportDlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PassportDlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
