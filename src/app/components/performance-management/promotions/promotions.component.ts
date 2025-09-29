import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';
import { EmployeeMastersService } from '../../master/employee.masters.service';

@Component({
  selector: 'app-promotions',
  templateUrl: './promotions.component.html',
  styleUrls: ['./promotions.component.css']
})
export class PromotionsComponent implements OnInit {

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
    this.fetchDesignations();
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
    })
  }

  clearData() {
    this.toggleScreen = false;
    this.employeeList = "";
    this.departmentModel = "";
    this.branchModel = "";
  }

  fetchDesignations() {
    let api: any = "designation/list_company/" + this.companyId+"?search=&page=&size=";
    this.crudOperationsService.getList(api).subscribe((resp: any) => {
      this.designationData = resp.data.content;
    })
  }

  promoteEmployee(data: any) {

    let object: any = {
      "employeeId": Number(data.employeeId),
      "increment": Number(this.companyId),
      "financialYearId": Number(this.designationModel)
    }
    let api: any = "employee/employee_promotion";
    this.crudOperationsService.create(object, api).subscribe((resp: any) => {
      this.designationData = resp.data.content;
      this.fetchEmployees();

    })
  }

  clearPromotion() {
    this.designationModel = "";
  }


}
