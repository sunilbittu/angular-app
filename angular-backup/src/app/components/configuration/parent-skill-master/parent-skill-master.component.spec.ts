import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParentSkillMasterComponent } from './parent-skill-master.component';

describe('ParentSkillMasterComponent', () => {
  let component: ParentSkillMasterComponent;
  let fixture: ComponentFixture<ParentSkillMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParentSkillMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParentSkillMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
