import { Component, OnInit } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';

@Component({
  selector: 'app-leave-type',
  templateUrl: './leave-type.component.html',
  styleUrls: ['./leave-type.component.css']
})
export class LeaveTypeComponent implements OnInit {

  public headers: any = ['Leave Type', 'Leave Description', 'Number Of Leave', 'Is Default', 'Action'];
  public years: any = [];
  public LeaveCode: any = '';
  public leaveDescription: any = '';
  public noOfLeave: any = '';
  public LeaveTypesObject: any = [];
  public leaveId: any = '';
  public togglebtn: boolean = true;
  public isLTExist: any;
  public isLeaveCodeBlank: any = '';
  public isLeaveDescriptionBlank: any = '';
  public isNoOfLeaveBlank: any = '';
  public checked: any = false;
  public submitted: boolean = false;

  constructor(public crudOperationsService: CrudOperationsService,
    private notification: NotifierService, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.fetchLeaveType();
  }

  createLeaveType() {
    this.submitted = true;
    if (this.LeaveCode != '' && this.leaveDescription != '' && this.noOfLeave != '') {
      let object = { 
        'leaveTypeCode': this.LeaveCode, 
        'leaveTypeDescription': this.leaveDescription, 
        'numberOfLeave': this.noOfLeave, 
        'company': { 'companyId': sessionStorage.getItem('companyId') },
        'isDefault': this.checked
      }
      this.crudOperationsService.create(object, 'leavetype').subscribe((data: any) => {
        this.notification.notify('success', data.message);
        this.cancel();
        this.fetchLeaveType();
      })
    } else {
      if (this.LeaveCode == '') {
        this.isLeaveCodeBlank = 'Leave Code can\'t be blank';
      }
      if (this.leaveDescription == '') {
        this.isLeaveDescriptionBlank = 'Leave Description can\'t be blank';
      }
      if (this.noOfLeave == '') {
        this.isNoOfLeaveBlank = 'Number Of Leave can\'t be blank';
      }
    }

  }

  fetchLeaveType() {
    this.spinner.show();
    this.crudOperationsService.getList('leavetype/dropdownList?id=' + sessionStorage.getItem('companyId')).subscribe((data: any) => {
      this.spinner.hide();
      this.LeaveTypesObject = data.data;
      this.LeaveTypesObject.sort((a: any, b: any) => a.leaveTypeId - b.leaveTypeId);
    },
      (error) => {
        this.spinner.hide();
        this.notification.notify('error', 'Something Went Worng');
      })
  }

  editLeaveType(leave: any) {
    this.togglebtn = false;
    this.leaveId = leave.leaveTypeId;
    this.LeaveCode = leave.leaveTypeCode;
    this.leaveDescription = leave.leaveTypeDescription;
    this.noOfLeave = leave.numberOfLeave;
    this.checked = leave.isDefault;
  }

  updateLeaveType() {
    this.submitted = true;
    if (this.LeaveCode != '' && this.leaveDescription != '' && this.noOfLeave != '') {
      let object = { 
        'leaveTypeId': this.leaveId, 
        'leaveTypeCode': this.LeaveCode, 
        'leaveTypeDescription': this.leaveDescription, 
        'numberOfLeave': this.noOfLeave,
        'isDefault': this.checked
      }
      let api: any = 'leavetype/' + this.leaveId;

      this.crudOperationsService.update(object, api).subscribe((data: any) => {
        this.notification.notify('success', data.message);
        this.cancel();
        this.fetchLeaveType();
      })
    }
  }

  removeLeaveType(leave: any) {
    this.leaveId = leave.leaveTypeId;
  }

  deleteLeaveType() {
    let api: any = 'leavetype/' + this.leaveId;
    this.crudOperationsService.delete(api).subscribe((data: any) => {
      this.fetchLeaveType();
      this.cancel();
    })
  }

  cancel() {
    this.submitted = false;
    this.togglebtn = true;
    this.leaveId = '';
    this.LeaveCode = '';
    this.leaveDescription = '';
    this.noOfLeave = '';
    this.checked = false;
  }

  check() {
    this.isLTExist = false;
    this.isLeaveCodeBlank = '';
    let api = 'leavetype/validate?name=' + this.LeaveCode + ' & companyId=' + sessionStorage.getItem('companyId');
    this.crudOperationsService.validate(api)
      .subscribe((data: any) => {
        this.isLTExist = data;
      },
        (_error: any) => {
          this.notification.notify('error', 'Something Went Worng');
        })
  }
  handleDescription() {
    if (this.leaveDescription != '') {
      this.isLeaveDescriptionBlank = ''
    }
  }

  handleNoOfLeave() {
    if (this.noOfLeave != '') {
      this.isNoOfLeaveBlank = ''
    }
  }
}
