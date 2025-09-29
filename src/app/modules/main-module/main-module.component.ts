import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';
import { AddEmployeeService } from 'src/app/components/master/addEmplyee.service';

@Component({
  selector: 'app-main-module',
  templateUrl: './main-module.component.html',
  styleUrls: ['./main-module.component.css']
})
export class MainModuleComponent implements OnInit {
  public role: any;
  public designation: any;
  public permisionsArray: any[] = [];
  constructor(
    private route: Router,
    private formBuilder: FormBuilder,
    public crudOperationsService: CrudOperationsService,
    private notification: NotifierService,
    private addEmployeeService: AddEmployeeService
  ) { }
  public userName: any = localStorage.getItem("userName");
  public firstName: any = sessionStorage.getItem("firstName");
  public companyId: any = sessionStorage.getItem("companyId");
  public companyName: any = sessionStorage.getItem("companyName");
  public employeeId: any = sessionStorage.getItem('empId');
  public settingsFlag: boolean = true;
  public loadNofication: boolean = false;

  ngOnInit(): void {
    this.loadNofication = false;
    this.getallPermissions();
    this.role = sessionStorage.getItem("role");
    this.designation = sessionStorage.getItem("designation");
    this.getUnreadNotificationCount();
  }
  // select-compony
  selectCompany() {
    this.route.navigateByUrl('select-company');
  }
  logout() {
    this.route.navigateByUrl('login');
  }

  changePassword() {
    (<any>$('#add')).modal('show');
    (<any>$('#viewdetails')).modal('hide');
  }
  public userCredentialMatchFound: boolean = false;
  public submitted = false;
  public isPasswordsNoteMatched = false;
  public resetForm = this.formBuilder.group({
    currentPassword: ["", Validators.required],
    newPassword: ["", Validators.required],
    confirmNewPassword: ["", Validators.required]
  })
  get resetForm_() { return this.resetForm.controls; };

  submit() {
    this.submitted = true;
    let oldPassword = this.resetForm.value.currentPassword;
    let confirmNewPassword = this.resetForm.value.confirmNewPassword;
    let newPassword = this.resetForm.value.newPassword;
    if (this.resetForm.valid)
      if (newPassword === confirmNewPassword) {
        this.isPasswordsNoteMatched = false;
        this.crudOperationsService.getList("employee/employee_change_password/" + this.companyId + "?id=" +
          this.employeeId + "&existingPassword=" + oldPassword + "&newPassword=" + confirmNewPassword).subscribe((data: any) => {
            if (data.data) {
              this.submitted = false;
              (<any>$('#add')).modal('hide');
              this.notification.notify('success', 'Password Updated Successfully!');
              this.resetTheForm();
            } else {
              this.userCredentialMatchFound = true;
              this.notification.notify('warning', 'Warning! Credentials not matched in DB. Please check once');
            }
          },
            (error) => {
              this.notification.notify('error', 'Something went wrong!');
            });
      } else {
        this.isPasswordsNoteMatched = true;
      }
  }
  resetTheForm() {
    this.resetForm.reset();
    this.isPasswordsNoteMatched = false;
    this.submitted = false;
    this.userCredentialMatchFound = false;
  }
  changePass() {
    this.isPasswordsNoteMatched = false;
  }
  changePwd() {
    this.userCredentialMatchFound = false;
  }
  menuclick() {
    this.settingsFlag = true;
  }
  blurmenu() {
    // $()
    this.settingsFlag = false;
    // this.toggleprofile=false;
  }
  getallPermissions() {
    let api: any = "employeepermissions/employeepermissionsfordisplay?employeeId=" + this.employeeId+"&companyId="+this.companyId;
    this.crudOperationsService.getList(api).subscribe((resp: any) => {
      this.permisionsArray = resp.data;
    })
  }

  public notificationList: any = [];
  public unreadNotificationCount: any = 0;
  public showSpinner: boolean = false;
  getNotificationList() {
    if (!this.loadNofication) {
      this.showSpinner = true;
      let api = 'notification/list?employeeId=' + this.employeeId;
      this.crudOperationsService.getList(api).subscribe((data: any) => {
        this.showSpinner = false;
        this.notificationList = data.data;
        this.loadNofication = true;
      },
        (error) => {
          this.showSpinner = false;
          console.log(error);
        })
    }
  }
  public notificationObj: any = '';
  clickNotification(notificationId: any) {
    (<any>$('#notification_modal_1')).modal('show');
    this.notificationObj = this.notificationList.find((e: any) => e.notificationId == notificationId);
    if (this.notificationObj.notificationStatus == 'Opened') {
      let api = 'notification/updateReadStatus?notificationId=' + notificationId + '&employeeId=' + this.employeeId;
      this.crudOperationsService.getList(api).subscribe((data: any) => {
        this.notificationList = data.data;
        this.updateNotificationCount();
      },
        (error: any) => {
          this.showSpinner = false;
          console.log(error);
        })
    }
  }
  public employeeList: any = [];
  
  getEmployeeList() {
    if (!this.loadNofication) {
      this.showSpinner = true;
     // let api = 'notification/list?employeeId=' + this.employeeId;
     this.addEmployeeService.getReportingEmployeeById(this.employeeId, this.companyId)
      .subscribe((data: any) => {
        this.employeeList = data.data;

      // })
      // this.crudOperationsService.getList(api).subscribe((data: any) => {
      //   this.showSpinner = false;
      //   this.notificationList = data.data;
        this.loadNofication = true;
      },
        (error) => {
          this.showSpinner = false;
          console.log(error);
        })
    }
  }
  public getUnreadNotificationCount() {
    let api = 'notification/count?employeeId=' + this.employeeId;
    this.crudOperationsService.getList(api).subscribe((data: any) => {
      this.unreadNotificationCount = data.data;
      this.unreadNotificationCount = this.unreadNotificationCount > 99 ? '99+' : this.unreadNotificationCount;
    },
      (error) => {
        console.log(error);
      })
  }

  updateNotificationCount() {
    this.getUnreadNotificationCount();
  }
}
