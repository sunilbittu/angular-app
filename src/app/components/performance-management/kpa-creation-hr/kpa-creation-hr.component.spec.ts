import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpaCreationHrComponent } from './kpa-creation-hr.component';

describe('KpaCreationHrComponent', () => {
  let component: KpaCreationHrComponent;
  let fixture: ComponentFixture<KpaCreationHrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KpaCreationHrComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KpaCreationHrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
