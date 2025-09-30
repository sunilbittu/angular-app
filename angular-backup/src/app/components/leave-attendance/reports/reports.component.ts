import { Component, OnInit } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';
import { AddEmployeeService } from '../../master/addEmplyee.service';
import { EmployeeMastersService } from '../../master/employee.masters.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {

  public role = sessionStorage.getItem("role");
  public LeaveTypesObject: any = [];
  public epmloyeeList: any = [];
  public empObj: any = [];
  public months: any = [{ name: "January", id: 1 }, { name: "February", id: 2 }, { name: "March", id: 3 },
  { name: "April", id: 4 }, { name: "May", id: 5 }, { name: "June", id: 6 },
  { name: "July", id: 7 }, { name: "August", id: 8 }, { name: "September", id: 9 },
  { name: "October", id: 10 }, { name: "November", id: 11 }, { name: "December", id: 12 },
  ];
  public RoutingLink: any = "";
  public years: any = [];
  public companyId: any;
  public companyName: any;
  public selectedYear: any = '';
  public spanLength: number = 2;
  public toggleLoader: boolean = false;
  public type = 'Yearly';
  public showError = false;
  public showErrorForEmp = false;
  public monthsSelected = '';
  public employeeName = '';
  public employeeCode = '';

  public selectedItems: any = [];
  public dropdownSettings: any = {
    singleSelection: false,
    idField: 'id',
    textField: 'name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 4,
    allowSearchFilter: true
  };

  onItemSelect(data: any) {
    console.log('data', data);
  }
  onSelectAll(event: any) {
    console.log('data', event);
  }
  onDeSelectAll(event: any) {
    console.log('data', event);
  }
  onItemDeSelect(data: any) {
    console.log('data', data);
  }

  constructor(public crudOperationsService: CrudOperationsService, private notification: NotifierService,
    private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.companyId = Number(sessionStorage.getItem('companyId'));
    this.companyName = sessionStorage.getItem("companyName");
    this.getLeaveHeader();
    this.getLeaveYearList();
  }
  public getLeaveYearList() {
    this.spinner.show();
    let api = 'leaveyear/list/' + this.companyId + '?page=0&size=100';
    this.crudOperationsService.getList(api).subscribe((data: any) => {
      this.spinner.hide();
      this.years = data.data.content;
    },
      (error) => {
        this.spinner.hide();
        console.log(error);
      })
  }
  getLeaveHeader() {
    this.spinner.show();
    this.crudOperationsService.getList('leavetype/dropdownList?id=' + this.companyId).subscribe((data: any) => {
      this.spinner.hide();
      this.LeaveTypesObject = data.data;
      this.spanLength = (this.LeaveTypesObject.length * 3) + 2;
    },
      (error) => {
        this.spinner.hide();
        this.notification.notify('error', 'Something Went Wrong');
      });
  }
  getLeaveReport(data: any) {
    this.showError = false;
    if (this.selectedYear) {
      this.epmloyeeList = [];
      this.toggleLoader = true;
      let url = 'leavemasterindividual/leave-master-ind?companyId=' +
        this.companyId + '&year=' + this.selectedYear;
      this.crudOperationsService.fetchEmployeeList(data, url).subscribe((data: any) => {
        (<any>$('#myModal')).modal('hide');
        this.toggleLoader = false;
        this.epmloyeeList = data.data;
      },
        (error) => {
          (<any>$('#myModal')).modal('hide');
          this.notification.notify('error', 'Something went wrong!');
        })
    } else {
      (<any>$('#myModal')).modal('hide');
      this.showError = true;
    }
  }

  onClick(value: any) {
    this.type = value;
    this.epmloyeeList = [];
    if (value === 'Yearly') {
      if (this.role == 'ROLE_EMPLOYEE') {
        this.empObj.push(Number(sessionStorage.getItem("empId")));
        const formObj = {
          'ids': this.empObj
        }
        this.getLeaveReport(formObj);
      } else {
        (<any>$('#myModal')).modal('show');
      }
    }
  }

  filterObj(event: any) {
    //console.log("event is======== ",event);
    const formObj = {
      'ids': JSON.parse(event)
    }
    this.getLeaveReport(formObj);
  }

  public results: any = [];
  public empId = '';
  viewLeaveSummary(id: any, firstName: any, lastName: any, code: any) {
    (<any>$('#monthly-report-emp-summary')).modal('show');
    this.employeeName = firstName + ' ' + lastName;
    this.employeeCode = code;
    this.monthsSelected = this.selectedItems.map((m: any) => m.name).join(', ');
    this.empId = id;
    let ids: any = [];
    this.selectedItems.forEach((item: any) => {
      ids.push(item.id);
    });
    const formObj = {
      'months': ids,
      'employeeId': id
    }

    let url = 'leavemasterindividual/getLeavesByMonths?companyId=' +
      this.companyId + '&year=' + this.selectedYear;
    this.crudOperationsService.fetchEmployeeList(formObj, url).subscribe((data: any) => {
      this.toggleLoader = false;
      this.results = data.data;
    },
      (error) => {
        this.notification.notify('error', 'Something went wrong!');
      })
  }

  selectEmployee() {
    this.showErrorForEmp = false;
    if (this.selectedItems.length == 0) {
      this.showErrorForEmp = true;
    } else {
      (<any>$('#myModal')).modal('show');
    }
  }


  exportTable(type: string) {
    this.companyId = Number(sessionStorage.getItem('companyId'));
    let ids: any = [];
    this.selectedItems.forEach((item: any) => {
      ids.push(item.id);
    });
    const formObj = {
      'employeeCode': this.employeeCode,
      'employeeName': this.employeeName,
      'selectedYear': this.selectedYear,
      'monthsSelected': this.monthsSelected,
      'months': ids,
      'employeeId': this.empId
    }
    //spinner show
    var fileType = '';
    if (type == 'EXCEL') {
      fileType = 'EmployeeMonthlyLeaveReport.xls';
      let api: any = 'reports/monthlyLeaveReport/exportPDF?companyId=' +
        this.companyId + '&year=' + this.selectedYear; this.crudOperationsService.exportExcelReport2(api, fileType, formObj)
    }
    else {
      fileType = 'EmployeesMonthlyLeaveReport.pdf';
      let api: any = 'reports/monthlyLeaveReport/exportPDF?companyId=' +
        this.companyId + '&year=' + this.selectedYear;
      this.crudOperationsService.exportPDF2(api, fileType, formObj)
    }
  }
}
