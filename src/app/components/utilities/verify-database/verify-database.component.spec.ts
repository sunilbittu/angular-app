import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyDatabaseComponent } from './verify-database.component';

describe('VerifyDatabaseComponent', () => {
  let component: VerifyDatabaseComponent;
  let fixture: ComponentFixture<VerifyDatabaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerifyDatabaseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifyDatabaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
