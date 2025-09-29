import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TdsProjectionComponent } from './tds-projection.component';

describe('TdsProjectionComponent', () => {
  let component: TdsProjectionComponent;
  let fixture: ComponentFixture<TdsProjectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TdsProjectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TdsProjectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
