import { Component, OnInit } from '@angular/core';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { NotifierService } from 'angular-notifier';
import { EmployeeMastersService } from 'src/app/components/master/employee.masters.service';



@Component({
  selector: 'app-employee-education-details',
  templateUrl: './employee-education-details.component.html',
  styleUrls: ['./employee-education-details.component.css']
})
export class EmployeeEducationDetailsComponent implements OnInit {

  public companyId: any = Number(sessionStorage.getItem("companyId"));
  public employeeEducationDetails: any = [];
  public branchDetailsList!: any[];
  public qualificationDetailsList!: any[];
  p: number=1;
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
  public educationQualificationList: any;
  public branchList: any = [];
  public branchModel: any = '';
  public selectedItems: any = [];
  public qualificationModel: any = '';
  public submitted: boolean = false;
  public isbranchNameSelected: boolean = false;
  constructor(public crudOperationsService: CrudOperationsService,
    private spinner: NgxSpinnerService, private notification: NotifierService,
    private crureService: CrudOperationsService, private employeMasterService: EmployeeMastersService) { }

  ngOnInit(): void {
    this.fetcEmployeesDetailsReport();
    this.fetchBranchDetailsList();
    this.fetchQualificationDetailsList();
  }

  public headers: any = ["Employee Code", "Employee Name", "Branch_Name", "Qualification"];

  public headers1: any = ["Qualification", "Institute", "Board", "Main Subject", "Division", "Marks%", "Passing Year", "Weightage", "iss"];


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

  search() {
    this.submitted = true;
    let empList = [];
    for (let i = 0; i < this.selectedItems.length; i++) {
      empList.push(this.selectedItems[i].companyBranchDetailsId);
    }
    this.branchIds = empList;
    if (this.selectedItems.length == 0) {
      this.isbranchNameSelected = false;
    } else {
      this.isbranchNameSelected = true;
    }
    this.educationQualificationList = [];
    if (this.selectedItems.length > 0) {
      this.fetcEmployeesDetailsReport();
      this.submitted = false;

    }
  }


  fetcEmployeesDetailsReport() {
    this.spinner.show();
    let api = "employee/employeeeducationreport/" + this.companyId + '?branchIds=' + this.branchIds + '&qualificationId=' + this.qualificationModel;
    this.crudOperationsService.getList(api).subscribe((data: any) => {
      this.spinner.hide();
      console.log(data, "===data");
      this.employeeEducationDetails = data.data;

    },
      (error) => {
        this.notification.notify('error', 'Something Went Worng');
        //spinner hide
        this.spinner.hide();
      })

  }
  exportTable(type: string) {

    //spinner show
    this.spinner.show();


    var fileType = '';
    let fileName='employee-education-details-report'
    if (type == 'EXCEL') {
      fileName=fileName+'.xls';
      fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    }
    else {
      fileName=fileName+'.pdf';
      fileType = 'application/pdf';
    }
    let api: any = "reports/employees_education_details_report/" + type + "?companyId=" + this.companyId;
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

  fetchBranchDetailsList() {
    //getting companyId from session-storage
    this.companyId = Number(sessionStorage.getItem('companyId'));
    return this.employeMasterService.getBranchMaster(this.companyId)
      .subscribe((data: any) => {

        this.branchList = data.data.content;

      }
        ,
        (error) => {
          this.notification.notify('error', 'Something Went Worng');
        })
  }
  fetchQualificationDetailsList() {

    let api: any = "qualificationmaster/list_company/1?search=&page=&size=10";

    this.crudOperationsService.getList(api)
      .subscribe((data: any) => {

        this.qualificationDetailsList = data.data.content;

      },
        (error) => {

          this.notification.notify('error', 'Something Went Worng');
        })

  }




}
