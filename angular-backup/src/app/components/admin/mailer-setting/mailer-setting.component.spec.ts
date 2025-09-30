import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MailerSettingComponent } from './mailer-setting.component';

describe('MailerSettingComponent', () => {
  let component: MailerSettingComponent;
  let fixture: ComponentFixture<MailerSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MailerSettingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MailerSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
