import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlStatementComponent } from './gl-statement.component';

describe('GlStatementComponent', () => {
  let component: GlStatementComponent;
  let fixture: ComponentFixture<GlStatementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GlStatementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GlStatementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
