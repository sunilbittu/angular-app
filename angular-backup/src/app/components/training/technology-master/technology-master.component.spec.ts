import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnologyMasterComponent } from './technology-master.component';

describe('TechnologyMasterComponent', () => {
  let component: TechnologyMasterComponent;
  let fixture: ComponentFixture<TechnologyMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TechnologyMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TechnologyMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
