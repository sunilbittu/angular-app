import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfigurationService } from '../configuration.service';


@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
  notificationForm: any = FormGroup;
  public loading = false;
  notificationSettingsData: any;
  id: any;
  // saveAlertSuccess: boolean;


  constructor(
    //private renderer: Renderer,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private notificationService: ConfigurationService,
  ) { }

  ngOnInit() {
    //this.spinner.show();
    //this.renderer.setElementClass(document.body, 'login-page', false);
    this.notificationService.fetchNotificationSettings().subscribe((data: any) => {
      // this.notificationSettingsData=data.data;
      //console.log(this.notificationSettingsData.id);
      data.data.forEach((element: any) => {
        this.spinner.hide();
        this.notificationSettingsData = element;
        this.id = element.id;
      },
        () => {
          this.spinner.hide();
        })
      this.notificationForm.patchValue({
        id: this.notificationSettingsData.id,
        openNewTicketSmsEnabled: this.notificationSettingsData.openNewTicketSmsEnabled,
        addTicketReplaySmsEnabled: this.notificationSettingsData.addTicketReplaySmsEnabled,
        reOpenTicketSmsEnabled: this.notificationSettingsData.reOpenTicketSmsEnabled,
        closeTicketSmsEnabled: this.notificationSettingsData.closeTicketSmsEnabled,
        updateScheduleSmsEnabled: this.notificationSettingsData.updateScheduleSmsEnabled,
        cancelScheduleSmsEnabled: this.notificationSettingsData.cancelScheduleSmsEnabled,
        openNewTicketEmailEnabled: this.notificationSettingsData.openNewTicketEmailEnabled,
        addTicketReplayEmailEnabled: this.notificationSettingsData.addTicketReplayEmailEnabled,
        closeTicketEmailEnabled: this.notificationSettingsData.closeTicketEmailEnabled,
        reOpenTicketEmailEnabled: this.notificationSettingsData.reOpenTicketEmailEnabled,
        updateScheduleEmailEnabled: this.notificationSettingsData.updateScheduleEmailEnabled,
        cancelScheduleEmailEnabled: this.notificationSettingsData.cancelScheduleEmailEnabled,
        openNewTicketWebEnabled: this.notificationSettingsData.openNewTicketWebEnabled,
        addTicketReplayWebEnabled: this.notificationSettingsData.addTicketReplayWebEnabled,
        closeTicketWebEnabled: this.notificationSettingsData.closeTicketWebEnabled,
        reOpenTicketWebEnabled: this.notificationSettingsData.reOpenTicketWebEnabled,
        updateScheduleWebEnabled: this.notificationSettingsData.updateScheduleWebEnabled,
        cancelScheduleWebEnabled: this.notificationSettingsData.cancelScheduleWebEnabled,
        openNewTicketMobileEnabled: this.notificationSettingsData.openNewTicketMobileEnabled,
        addTicketReplayMobileEnabled: this.notificationSettingsData.addTicketReplayMobileEnabled,
        closeTicketMobileEnabled: this.notificationSettingsData.closeTicketMobileEnabled,
        reOpenTicketMobileEnabled: this.notificationSettingsData.reOpenTicketMobileEnabled,
        updateScheduleMobileEnabled: this.notificationSettingsData.updateScheduleMobileEnabled,
        cancelScheduleMobileEnabled: this.notificationSettingsData.cancelScheduleMobileEnabled,
        helpDeskTicketSmsEnabled: this.notificationSettingsData.helpDeskTicketSmsEnabled,
        helpDeskTicketEmailEnabled: this.notificationSettingsData.helpDeskTicketEmailEnabled,
        helpDeskTicketWebEnabled: this.notificationSettingsData.helpDeskTicketWebEnabled
      });
    })
    this.notificationForm = this.fb.group({
      id: [''],
      openNewTicketSmsEnabled: [''],
      addTicketReplaySmsEnabled: [''],
      reOpenTicketSmsEnabled: [''],
      closeTicketSmsEnabled: [''],
      updateScheduleSmsEnabled: [''],
      cancelScheduleSmsEnabled: [''],
      openNewTicketEmailEnabled: [''],
      addTicketReplayEmailEnabled: [''],
      closeTicketEmailEnabled: [''],
      reOpenTicketEmailEnabled: [''],
      updateScheduleEmailEnabled: [''],
      cancelScheduleEmailEnabled: [''],
      openNewTicketWebEnabled: [''],
      addTicketReplayWebEnabled: [''],
      closeTicketWebEnabled: [''],
      reOpenTicketWebEnabled: [''],
      updateScheduleWebEnabled: [''],
      cancelScheduleWebEnabled: [''],
      openNewTicketMobileEnabled: [''],
      addTicketReplayMobileEnabled: [''],
      closeTicketMobileEnabled: [''],
      reOpenTicketMobileEnabled: [''],
      updateScheduleMobileEnabled: [''],
      cancelScheduleMobileEnabled: [''],
      helpDeskTicketSmsEnabled: [''],
      helpDeskTicketEmailEnabled: [''],
      helpDeskTicketWebEnabled: ['']
    });
  }
  updateSettings(from: FormGroup) {
    console.log("hiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii", this.notificationForm.value);
    this.notificationForm.value.id = this.id;
    this.loading = true;
    this.notificationService.updateNotificationSettings(this.notificationForm.value).subscribe((data: any) => {
      // data = data.data;
      if (data.status == 1) {
        this.loading = false;
        // this.saveAlertSuccess=true;
        setTimeout(() => {    //<<<---    using ()=> syntax

          //  this.saveAlertSuccess=false;
        }, 5000);
      }
      this.ngOnInit()
    });

  }
}

