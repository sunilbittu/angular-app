import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  @Input() public list: any = [];

  constructor(private spinner: NgxSpinnerService,
    public crudOperationsService: CrudOperationsService, private notification: NotifierService) { }

  public api = 'chat_history';
  public chatList: any = [];
  public notificationList: any = [];
  public companyId: any = Number(sessionStorage.getItem('companyId'));
  public senderFirstName: any = sessionStorage.getItem("firstName");
  public employeeId: any = Number(sessionStorage.getItem('empId'));
  public employeeName: any = sessionStorage.getItem("firstName");
  public id: any;
  public notificationObj: any = '';
  public sendText: any ='';
  public receiverEmployeeId: any;
  public receiverEmployeeName: any = '';

  ngOnInit(): void { }

  clickNotification(receiverEmployeeId: any, receiverEmployeeName: any) {
    $('.modal-backdrop').remove();
    console.log("receiverEmployeeId ===== ",receiverEmployeeId);
    this.receiverEmployeeId = receiverEmployeeId;
    this.receiverEmployeeName = receiverEmployeeName;

  
       let api = this.api + '/findAllChatsByCompany/'+this.companyId+'/' + this.employeeId + '/' + this.receiverEmployeeId;
       this.crudOperationsService.getList(api).subscribe((data: any) => {
         this.chatList = data.data.content;
        
       },
         (error: any) => {
           
           console.log(error);
         })
    
  }
  btnComponentSend(){
    let object = {
      "chatMessage":this.sendText,
      "senderId":this.employeeId,
      "senderName":this.senderFirstName,
      "receiverId":this.receiverEmployeeId,
      "receiverName":this.receiverEmployeeName,
    };
    console.log("message is ======== ",this.sendText);

    this.crudOperationsService.create(object, this.api)
      .subscribe((data: any) => {
        this.notification.notify('success', data.message);
        this.sendText ='';
        this.clickNotification(this.receiverEmployeeId,this.receiverEmployeeName);
       // (<any>$('#add-edit-popup')).modal('hide');
        //this.submitProcessing = false;
       // this.ngOnInit();
       // this.clear();
      },
        (_error) => {
         // this.submitProcessing = false;
          this.notification.notify('error', 'Something Went Wrong')
        })
  }

  @Output() updateNotificationCount = new EventEmitter<string>();

  updateUnreadNotificationCount() {
    this.updateNotificationCount.emit();
  }
}
