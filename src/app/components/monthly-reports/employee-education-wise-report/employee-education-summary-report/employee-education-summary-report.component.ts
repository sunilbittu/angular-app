import { Component, OnInit } from '@angular/core';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { NotifierService } from 'angular-notifier';
import { EmployeeMastersService } from 'src/app/components/master/employee.masters.service';
@Component({
  selector: 'app-employee-education-summary-report',
  templateUrl: './employee-education-summary-report.component.html',
  styleUrls: ['./employee-education-summary-report.component.css']
})
export class EmployeeEducationSummaryReportComponent implements OnInit {
  public branchList: any = [];
  public branchModel: any = '';
  public selectedItems: any = [];
  public companyId: any = Number(sessionStorage.getItem("companyId"));
  public educationQualificationList: any;
  public qualificationDetailsList: any = [];
  public qualificationModel: any = '';
  public submitted: boolean = false;
  public isbranchNameSelected: boolean = false;
  public dropdownSettings = {
    singleSelection: false,
    idField: 'companyBranchDetailsId',
    textField: 'branchName',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 3,
    allowSearchFilter: true
  };
  branchIds: any = [];
  employeesBranchCountList: any;
  public isqualificationNameSelecte: any = false;
  p: number = 1;

  constructor(private crureService: CrudOperationsService, public crudOperationsService: CrudOperationsService,
    private spinner: NgxSpinnerService, private notification: NotifierService, private employeMasterService: EmployeeMastersService) { }
  ngOnInit(): void {
    this.fetchNoEmployeesReport();
    this.fetchBranchDetailsList(this.companyId);
    this.fetchQualificationDetailsList();
  }
  public headersCount: any = ["Employee Code", "Name", "Branch", "Department"];
  public headers: any = ["S.No", "Branch Name", "Qualification Name", "Department Name", "No of Employees"];
  fetchQualificationDetailsList() {
    let api: any = "qualificationmaster/list_company/" + this.companyId+"?search=&page=&size=10";
    this.crudOperationsService.getList(api)
      .subscribe((data: any) => {
        this.qualificationDetailsList = data.data.content;
      },
        (error) => {
          this.notification.notify('error', 'Something Went Worng');
        })
  }
  fetchBranchDetailsList(id: any) {
    return this.employeMasterService.getBranchMaster(id)
      .subscribe((data: any) => {
        this.branchList = data.data.content;
      },
        (error) => {
        })
  }
  changeBranch(event: any) {
    const companyBranchDetailsId = event.target.value;
    this.fetchListByBranch(companyBranchDetailsId);
  }
  fetchListByBranch(companyBranchDetailsId: any) {
    throw new Error('Method not implemented.');
  }
  fetchNoEmployeesReport() {
    let api = "employee/employeeEducationSummaryList/" + this.companyId + '?branchIds=' + this.branchIds + '&qualificationId=' + this.qualificationModel;
    this.crudOperationsService.getList(api).subscribe((data: any) => {
      console.log(data, "===data");
      this.educationQualificationList = data.data;
    })
  }
  exportTable(type: string) {
    //spinner show
    this.spinner.show();
    var fileType = '';
    let fileName='employee-qualification-report'
    if (type == 'EXCEL') {
      fileName=fileName+'.xls';
      fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    }
    else {
      fileName=fileName+'.pdf';
      fileType = 'application/pdf';
    }
    let api: any = "reports/employees_per_qualification_report/" + type + "?companyId=" + this.companyId + '&branchIds=' + this.branchIds + '&qualificationId=' + this.qualificationModel;
    this.crureService.downloadDocument(api)
      .subscribe((response: any) => {
        //spinner hide
        this.spinner.hide();
        let blob: any = new Blob([response], { type: fileType });
        const url = window.URL.createObjectURL(blob);
        if(type!='EXCEL'){
          window.open(url);
        }
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = fileName;

        anchor.click();
        //window.location.href = response.url;
        //this._FileSaverService.save(blob,'Employee_Branch_Report');
      },
        (error) => {
          this.notification.notify('error', 'Something Went Worng');
          //spinner hide
          this.spinner.hide();
        }
      )
  }
  onItemSelect(data: any) {
    console.log('data', data);
    this.isbranchNameSelected = true;
  }
  onSelectAll(event: any) {
    console.log('data', event);
    this.isbranchNameSelected = true;
  }
  onDeSelectAll(event: any) {
    console.log('data', event);
    this.isbranchNameSelected = false;
  }
  onItemDeSelect(data: any) {
    console.log('data', data);
  }
  change() {
    if (this.qualificationModel == "") {
      this.isqualificationNameSelecte = false;
    } else {
      this.isqualificationNameSelecte = true;
    }
  }
  search() {
    this.submitted = true;
    let empList = [];
    for (let i = 0; i < this.selectedItems.length; i++) {
      empList.push(this.selectedItems[i].companyBranchDetailsId);
    }
    if (this.selectedItems.length == 0) {
      this.isbranchNameSelected = false;
    } else {
      this.isbranchNameSelected = true;
    }
    if (this.qualificationModel == "") {
      this.isqualificationNameSelecte = false;
    } else {
      this.isqualificationNameSelecte = true;
    }
    this.branchIds = empList;
    this.educationQualificationList = [];
    if (this.isqualificationNameSelecte && this.isbranchNameSelected) {
      this.fetchNoEmployeesReport();
      this.isqualificationNameSelecte = false;
      this.submitted = false;
      this.isbranchNameSelected = false;
    }
  }
  public tempData: any;
  getEmployeeList(data: any) {
    this.p = 1;
    this.tempData = data;
    let api = "employee/employeeEducationSummaryEmployeeList/" + this.companyId + '?branchName=' + data.branchName + '&qualificationName=' + data.qualificationname + '&departmentName=' + data.departmentName;
    this.crudOperationsService.getList(api).subscribe((data: any) => {
      console.log(data, "=== employeedata");
      this.employeesBranchCountList = data.data;
    })
  }

  exportInnerTable(type: string) {
    //spinner show
    this.spinner.show();
    var fileType = '';
    let fileName = 'Employee_Qualification_Report';
    if (type == 'EXCEL') {
      fileName = fileName + '.xls'
      fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    }
    else {
      fileType = 'application/pdf';
      fileName = fileName + '.pdf'
    }
    let api: any = "reports/employees_per_qualification_report_by_id/" + type + "?companyId=" + this.companyId + '&branchName=' + this.tempData.branchName + '&qualificationName=' + this.tempData.qualificationname + '&departmentName=' + this.tempData.departmentName;
    this.crureService.downloadDocument(api)
      .subscribe((response: any) => {
        //spinner hide
        this.spinner.hide();
        let blob: any = new Blob([response], { type: fileType });
        const url = window.URL.createObjectURL(blob);
        if (type != 'EXCEL') {
          window.open(url);
        }
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = fileName;

        anchor.click();
        //window.location.href = response.url;
        //this._FileSaverService.save(blob,'Employee_Branch_Report');
      },
        (error) => {
          this.notification.notify('error', 'Something Went Worng');
          //spinner hide
          this.spinner.hide();
        }
      )
  }

}
