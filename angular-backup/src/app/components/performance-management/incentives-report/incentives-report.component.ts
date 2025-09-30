import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';
import { EmployeeMastersService } from '../../master/employee.masters.service';

@Component({
  selector: 'app-incentives-report',
  templateUrl: './incentives-report.component.html',
  styleUrls: ['./incentives-report.component.css']
})
export class IncentivesReportComponent implements OnInit {

  public companyId = Number(sessionStorage.getItem("companyId"));
  public departmentData: any;
  public selectedDepartment: any;
  public departmentModel: any;
 // public headers2: any = ["Recruiter Name","Client Name", "Candidate Name", "Joined Date", "Salary Offered", "Regular Incentive", "Additional Incentive", "Total","Payment Date"];
  public employeeList: any;
  public selectedDepartmentName: any;
  public leaveYear: any = [];
  public branchData: any;
  public selectedBranch: any;
  public branchModel: any;
  public toggleScreen: any;
  public employeeData: any;
  public designationData: any;
  public designationModel: any;
  public projectName: any;
  public categoryName: any;
  public designationName: any;
  public gradeName: any;
  public departmentName: any;
  public branchName: any;
  public employeeCode: any;
  public lastName: any;
  public firstName: any;
  public leavesList: any;
  public currentYear: any;
  public leaveMasterIndividualId: any;
  public employeesLoansData: any;
  public employeesTdsData: any;
  public encashMentAmount: any;
  public requiredErrorText = 'can\'t be blank';
  public headers3: any = ["Loan Type", "Date", "Loan Amount", "Installment Amount", "Installment Months", "Start Recovery Month", "Start Recovery Year", "Status"];

  constructor(public crudOperationsService: CrudOperationsService,
    public employeeMastersService: EmployeeMastersService, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.getLeaveYearList();
  }
  
  public getLeaveYearList() {
    this.spinner.show();
    let api = 'leaveyear/list/' + this.companyId + '?page=0&size=100';
    this.crudOperationsService.getList(api).subscribe((data: any) => {
      this.spinner.hide();
      this.leaveYear = data.data.content;
    },
      (error) => {
        this.spinner.hide();
        console.log(error);
      })
  }

  fetchBranches() {
    this.spinner.show();
    this.employeeMastersService.getBranchMaster(this.companyId).subscribe((data: any) => {
      this.spinner.hide();
      this.branchData = data.data.content;
    },
      (error) => {
        this.spinner.hide();
        console.log(error);
      })
  }

  fetchDepartments() {
    this.employeeMastersService.getDepartmentListByBranchId(this.branchModel).subscribe((data: any) => {
      this.departmentData = data.data;
    })
  }
  public leaveYearValidation:boolean=false;
  public submitted: boolean = false; 
  fetchEmployees() {
    this.submitted=true;
    this.toggleScreen = true;
     //console.log(this.branchModel);
    //console.log(this.departmentModel);
    if (!this.branchModel) {
      this.leaveYearValidation = true;
  } else {
      this.leaveYearValidation = false; 
  }
  this.spinner.show();
    let api: any = "candidate/findAllInvoicesForReport?year="+this.branchModel+"&quater="+this.departmentModel;
    this.crudOperationsService.getList(api).subscribe((data: any) => {
      this.spinner.hide();
      this.employeeList = data.data;
    })
    this.spinner.hide();
  }

  onSorted($event: Event) {
    let data: any = $event;
    console.log("data ::: ", data)
    let sortedArray = (this.employeeList || []).sort((a: any, b: any) => {
      if (a[data.sortColumn] > b[data.sortColumn]) {
        return (data.sortDirection === 'desc') ? 1 : -1;
      }
      if (a[data.sortColumn] < b[data.sortColumn]) {
        return (data.sortDirection === 'desc') ? -1 : 1;
      }
      return 0;
    })
    this.employeeList = sortedArray;
  }

  getDepartment(data: any) {
    this.selectedDepartment = this.departmentModel;
  }
  

  clearData() {
    this.toggleScreen = false;
    this.employeeList = "";
    this.departmentModel = "";
    this.branchModel = "";
  }



  clearPromotion() {
    this.designationModel = "";
  }

}
