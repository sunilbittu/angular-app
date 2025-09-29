import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillHobbiesComponent } from './skill-hobbies.component';

describe('SkillHobbiesComponent', () => {
  let component: SkillHobbiesComponent;
  let fixture: ComponentFixture<SkillHobbiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SkillHobbiesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillHobbiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
