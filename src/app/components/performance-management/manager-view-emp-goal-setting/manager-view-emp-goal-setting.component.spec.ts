import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerViewEmpGoalSettingComponent } from './manager-view-emp-goal-setting.component';

describe('ManagerViewEmpGoalSettingComponent', () => {
  let component: ManagerViewEmpGoalSettingComponent;
  let fixture: ComponentFixture<ManagerViewEmpGoalSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManagerViewEmpGoalSettingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerViewEmpGoalSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
