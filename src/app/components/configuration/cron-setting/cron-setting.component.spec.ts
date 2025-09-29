import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CronSettingComponent } from './cron-setting.component';

describe('CronSettingComponent', () => {
  let component: CronSettingComponent;
  let fixture: ComponentFixture<CronSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CronSettingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CronSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
