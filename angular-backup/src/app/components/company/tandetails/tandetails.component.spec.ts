import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TANDetailsComponent } from './tandetails.component';

describe('TANDetailsComponent', () => {
  let component: TANDetailsComponent;
  let fixture: ComponentFixture<TANDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TANDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TANDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
