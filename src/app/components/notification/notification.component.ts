import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {

  @Input() public list: any = [];

  constructor(private spinner: NgxSpinnerService,
    public crudOperationsService: CrudOperationsService, private notification: NotifierService) { }

  public api = 'notification';
  public notificationList: any = [];
  public employeeId: any = Number(sessionStorage.getItem('empId'));
  public id: any;
  public notificationObj: any = '';

  ngOnInit(): void { }

  clickNotification(notificationId: any) {
    this.notificationObj = this.list.find((e: any) => e.notificationId == notificationId);
    if (this.notificationObj.notificationStatus == 'Opened') {
      let api = this.api + '/updateReadStatus?notificationId=' + notificationId + '&employeeId=' + this.employeeId;
      this.crudOperationsService.getList(api).subscribe((data: any) => {
        this.list = data.data;
        this.updateUnreadNotificationCount();
      },
        (error: any) => {
          this.spinner.hide();
          console.log(error);
        })
    }
  }

  @Output() updateNotificationCount = new EventEmitter<string>();

  updateUnreadNotificationCount() {
    this.updateNotificationCount.emit();
  }
}
