import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExitTemplateComponent } from './exit-template.component';

describe('ExitTemplateComponent', () => {
  let component: ExitTemplateComponent;
  let fixture: ComponentFixture<ExitTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExitTemplateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExitTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
