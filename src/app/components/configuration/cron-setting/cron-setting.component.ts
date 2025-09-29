import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';
import { AddEmployeeService } from '../../master/addEmplyee.service';

@Component({
  selector: 'app-cron-setting',
  templateUrl: './cron-setting.component.html',
  styleUrls: ['./cron-setting.component.css']
})
export class CronSettingComponent implements OnInit {

  public daysList: any = [15, 30, 45, 60];
  public everyList: any = [];
  public recurList: any;
  public submitted: boolean = false;
  public updateButton: boolean = false;
  public settingFrom: any = this.formBuilder.group({
    name: ['', [Validators.required]]
  });
  public settingFromObject: any;
  public recurGetById: any;
  public color = ' ';
  public headers: any = ['Name', 'Days', 'Scheduler', 'HR', 'Actions'];
  public companyId: any = Number(sessionStorage.getItem('companyId'));
  public employeeId: any = Number(sessionStorage.getItem('empId'));
  public cronList: any = [];
  public id: any = '';
  public requiredErrorText = 'can\'t be blank';
  public submitText = '';
  public api = 'cron-setting'
  public submitProcessing = false;
  public employeeDetails: any = {};
  public popoverTitle = 'Delete Confirmation';
  public popoverMessage = 'Are you sure you want delete';
  public confirmClicked = false;
  public cancelClicked = false;
  public submitErrorText: any = '';
  public isValidEmail: boolean = true;
  public schedulerList: any = ['Every Minute', 'Every Five Minute', 'Every Ten Minute', 'Every Thirty Minute',
    'Every Hour', 'Every Day', 'Every Week', 'Monthly', 'Yearly'];

  // pagination
  public p: number = 1;
  public itemsPerPage: any;
  public totalItems: any;
  public currentPage: any;
  public totalElements: number = 0;
  public showingFrom: number = 0;
  public showingTo: number = 0;
  public pageNumber: Number = 0;
  public pageSize: number = 20;
  public every: any = null;
  public checked: any = true;
  public orderExist = false;
  public tempOrderValue: any = '';
  public showEvery: boolean = false;
  public chartStartDate: any;
  public chartEndDate: any;
  public selectedStartDate: any;
  public selectedEndDate: any;
  public timeModel: any = '';
  public showAdditionalFieldDay: boolean = false;
  public showAdditionalFieldWeek: boolean = false;
  public showAdditionalFieldMonth: boolean = false;
  public showAdditionalFieldTime: boolean = false;
  public schedulerModel: any = null;
  public monthModel: any = null;
  public weekModel: any = null;
  public dayModel: any = null;

  get f() { return this.settingFrom.controls; }
  get _form() { return this.settingFrom.value };

  public selectedItemsUser: any = [];
  public selectedItemsDays: any = [];
  public employeeList: any = [];

  public dropdownSettingsUser = {
    singleSelection: false,
    idField: 'employeeId',
    textField: 'fullName',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 2,
    allowSearchFilter: false,
  };
  public dropdownSettingsDays = {
    singleSelection: false,
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 3,
    allowSearchFilter: false,
  };

  onItemSelectUser(data: any) { }
  onItemSelectDays(data: any) { }
  OnDaysItemDeSelect(item: any) { }
  OnUserItemDeSelect(item: any) { }
  onSelectAllUser(event: any) { }
  onSelectAllDays(event: any) { }

  constructor(private crudOperationsService: CrudOperationsService, private employeeService: AddEmployeeService,
    private notification: NotifierService, private spinner: NgxSpinnerService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.getCronList();
    this.getEmployees();
  }

  getEmployees() {
    this.employeeList = [];
    let listApi = 'employee/get_hr_list?companyId=' + this.companyId;
    this.crudOperationsService.getList(listApi)
      .subscribe((data: any) => {
        this.employeeList = data.data;
      },
        (error) => {
          this.notification.notify('error', 'Something Went Wrong');
        })
  }
  getCronList() {
    this.spinner.show();
    let api = this.api + '/list/' + this.companyId + '?page=' + this.pageNumber + '&size=' + this.pageSize;
    this.crudOperationsService.getList(api).subscribe((data: any) => {
      this.spinner.hide();
      this.cronList = data.data.content;
      //pagination call
      this.handlePagination(data);
    },
      (error) => {
        this.spinner.hide();
        console.log(error);
      })
  }

  public handlePagination(data: any): void {
    this.totalElements = data.data.totalElements;
    this.currentPage = data.data.pageable.pageNumber + 1;
    this.totalItems = (data.data.totalPages) * this.pageSize;
    this.showingFrom = (data.data.pageable.pageNumber * this.pageSize) + 1;
    const to = (data.data.pageable.pageNumber + 1) * this.pageSize;
    if (this.totalElements >= to) {
      this.showingTo = to;
    } else {
      this.showingTo = this.totalElements;
    }
  }
  public pageChanged(event: any): void {
    this.pageNumber = event - 1;
    this.getCronList();
  }

  modelShow() {
    this.clear();
  }

  loadFormData(data: any) {
    this.selectedItemsUser = [];
    this.settingFrom.reset();
    this.f['name'].patchValue(data.name);
    this.selectedItemsDays = data.days ? data.days : [];
    this.schedulerModel = data.scheduler;
    this.monthModel = data.typeMonth;
    this.weekModel = data.typeWeek;
    this.dayModel = data.typeDay;
    this.timeModel = data.executionTime;
    this.handlescheduler();
    if (data.hr && data.hr.length > 0) {
      data.hr.forEach((hr: any) => {
        this.employeeList.forEach((e: any) => {
          if (hr == e.employeeId) {
            this.selectedItemsUser.push(e);
          }
        })
      });
    }
    (<any>$('#cron-settingAddPopup')).modal('show');
  }

  modelShowEdit(data: any) {
    this.submitted = false;
    this.submitText = 'Update';
    this.id = data.id;
    this.loadFormData(data);
  }

  update() {
    this.submitted = true;
    for (let el in this.settingFrom.controls) {
      if (this.settingFrom.controls[el].errors) {
        console.log(el)
      }
    }
    if (this.isFormValid()) {
      let formData = this.getFormData();
      this.submitProcessing = true;
      this.crudOperationsService.update(formData, this.api + `/${this.id}`)
        .subscribe((data: any) => {
          this.notification.notify(data.status, data.message);
          this.submitProcessing = false;
          if (data.status == 'success') {
            (<any>$('#cron-settingAddPopup')).modal('hide');
            this.ngOnInit();
            this.clear();
          }
        },
          (_error) => {
            this.submitProcessing = false;
            this.notification.notify('error', 'Something Went Wrong')
          })
    }
  }
  isFormValid(): any {
    return this.settingFrom.valid
      && this.schedulerModel
      && this.selectedItemsDays.length > 0
      && this.selectedItemsUser.length > 0
      && this.checkTime()
      && this.checkWeek()
      && this.checkMonthly()
      && this.checkYearly();
  }
  checkYearly(): any {
    let scheduler = this.schedulerModel;
    if (scheduler == 'Yearly') {
      return this.monthModel && this.dayModel;
    }
    return true;
  }

  checkMonthly(): any {
    let scheduler = this.schedulerModel;
    if (scheduler == 'Monthly') {
      return this.dayModel;
    }
    return true;
  }

  checkWeek(): any {
    let scheduler = this.schedulerModel;
    if (scheduler == 'Every Week') {
      return this.weekModel;
    }
    return true;
  }

  checkTime(): any {
    let scheduler = this.schedulerModel;
    if (scheduler == 'Every Day' || scheduler == 'Every Week' || scheduler == 'Monthly' || scheduler == 'Yearly') {
      return this.timeModel;
    }
    return true;
  }

  getFormData(): any {
    let companyId = {
      'companyId': this.companyId
    };
    let empList = [];
    for (let i = 0; i < this.selectedItemsUser.length; i++) {
      empList.push(this.selectedItemsUser[i].employeeId);
    }
    let object = {
      "companyId": companyId,
      "days": this.selectedItemsDays,
      "scheduler": this.schedulerModel,
      "typeMonth": this.monthModel,
      "typeWeek": this.weekModel,
      "typeDay": this.dayModel,
      "executionTime": this.timeModel,
      "hr": empList,
    };
    return object;
  }

  clear() {
    this.submitted = false;
  }

  delete(id: number) {
    this.crudOperationsService.delete(this.api + `/${id}`).subscribe((data: any) => {
      this.notification.notify('success', data.message);
      this.ngOnInit();
    }, (error) => { this.notification.notify('error', 'something went wrong') })
  }

  public weekList = [];
  public dayList = [];
  public monthList = [];

  handlescheduler() {
    this.showAdditionalFieldDay = false;
    this.showAdditionalFieldWeek = false;
    this.showAdditionalFieldMonth = false;
    this.showAdditionalFieldTime = false;
    let scheduler = this.schedulerModel;
    if (scheduler == 'Every Day' || scheduler == 'Every Week' || scheduler == 'Monthly' || scheduler == 'Yearly') {
      this.showAdditionalFieldTime = true;
      switch (scheduler) {
        case 'Every Week':
          this.showAdditionalFieldWeek = true;
          this.weekList = this.getWeekDays();
          break;
        case 'Monthly':
          this.showAdditionalFieldDay = true;
          this.dayList = this.getMonthDays();
          break;
        case 'Yearly':
          this.showAdditionalFieldDay = true;
          this.showAdditionalFieldMonth = true;
          this.monthList = this.getYearMonths();
          this.dayList = this.getMonthDays();
          break;
      }
    }
  }

  getWeekDays(): any {
    return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  }
  getMonthDays(): any {
    let days = [];
    for (let i = 1; i <= 31; i++) {
      days.push(i);
    }
    return days;
  }
  getYearMonths(): any {
    return ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
  }


}
