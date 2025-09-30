import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';
import { EmployeeMastersService } from '../../master/employee.masters.service';

@Component({
  selector: 'app-termination',
  templateUrl: './termination.component.html',
  styleUrls: ['./termination.component.css']
})
export class TerminationComponent implements OnInit {

  public companyId = Number(sessionStorage.getItem("companyId"));
  public departmentData: any;
  public selectedDepartment: any;
  public departmentModel: any;
  public headers2: any = ["Code", "Name", "Department", "Branch", "Designation", "Grade", "Category", "Project", "Action"];
  public employeeList: any;
  public selectedDepartmentName: any;
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
  public headers3: any = ["Loan Type", "Date", "Loan Amount", "Installment Amount", "Installment Months", "Start Recovery Month", "Start Recovery Year", "Status"];

  constructor(public crudOperationsService: CrudOperationsService,
    public employeeMastersService: EmployeeMastersService, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.fetchBranches();
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

  fetchEmployees() {
    this.toggleScreen = true;
    let api: any = "employee/employee_master_department_employeeList2/" + this.departmentModel + "/" + this.companyId;
    this.crudOperationsService.getList(api).subscribe((data: any) => {
      this.employeeList = data.data;
    })
  }

  getDepartment(data: any) {
    this.selectedDepartment = this.departmentModel;
  }

  editPromotion(data: any) {
    let api: any = "employee/" + data.employeeId;


    this.crudOperationsService.getList(api).subscribe((resp: any) => {
      this.employeeData = resp.data;
      this.firstName = this.employeeData.firstName;
      this.lastName = this.employeeData.lastName;
      this.employeeCode = this.employeeData.employeeCode;
      this.branchName = this.employeeData.branchDetail.branchName;
      this.departmentName = this.employeeData.department.departmentName;
      this.gradeName = this.employeeData.gradeMaster.gradeName;
      this.designationName = this.employeeData.designation.designationName;
      this.categoryName = this.employeeData.categoryMaster.categoryName;
      this.projectName = this.employeeData.projectMaster.projectName;
    });

    this.currentYear = new Date().getFullYear()
    this.crudOperationsService.getList('leavemasterindividual/list_by_employee_individual/' + data.employeeId + '/' + this.currentYear).subscribe((data: any) => {
      this.leavesList = data.data.leaveTypeInfo;
      this.leaveMasterIndividualId = data.data.leaveMasterIndividualId;

    });

    this.crudOperationsService.getList('leavemasterindividual/list_by_employee_individual_leaveencashment/' + data.employeeId + '/' + this.currentYear).subscribe((data: any) => {
      console.log("dataaaaa", data.data)
      this.encashMentAmount = data.data;
    });



    this.crudOperationsService.getLoansByEmployee(data.employeeId, "SalaryAdvance").subscribe((data: any) => {
      this.employeesLoansData = data.data;
    });

    let tdsApi: any = "taxprojection/tdsDeductedTillNow/" + data.employeeId;
    this.crudOperationsService.getList(tdsApi).subscribe((data: any) => {
      if (data.data == null) {
        this.employeesTdsData = 0;
      } else {
        this.employeesTdsData = data.data;
      }
    });

  }

  clearData() {
    this.toggleScreen = false;
    this.employeeList = "";
    this.departmentModel = "";
    this.branchModel = "";
  }



  // taxprojection/tdsDeductedTillNow/{employeeId}

  terminateEmployee(data: any) {
    let api: any = "leavemasterindividual/terminateEmployee/" + data.employeeId;
    this.crudOperationsService.getList(api).subscribe((resp: any) => {
      console.log(data.firstName, " terminated successfully")
      this.fetchEmployees();

    })
  }

  clearPromotion() {
    this.designationModel = "";
  }

}
