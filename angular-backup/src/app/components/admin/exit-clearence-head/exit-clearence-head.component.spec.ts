import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExitClearenceHeadComponent } from './exit-clearence-head.component';

describe('ExitClearenceHeadComponent', () => {
  let component: ExitClearenceHeadComponent;
  let fixture: ComponentFixture<ExitClearenceHeadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExitClearenceHeadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExitClearenceHeadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
