import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';
import { EmployeeMastersService } from '../../master/employee.masters.service';

@Component({
  selector: 'app-employee-relieve',
  templateUrl: './employee-relieve.component.html',
  styleUrls: ['./employee-relieve.component.css']
})
export class EmployeeRelieveComponent implements OnInit {

  public companyId = Number(sessionStorage.getItem("companyId"));
  public departmentData: any;
  public selectedDepartment: any;
  public departmentModel: any;
  public headers2: any = ["Code", "Name", "Project", "Department", "Resignation Date", "Last Working Day", "Reason", "Status", "Action"];
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
  public relieveDate: any;
  public finalSettlement: any;
  public empResgId: any;
  public relieveObject!: any;



  public headers3: any = ["Loan Type", "Date", "Loan Amount", "Installment Amount", "Installment Months", "Start Recovery Month", "Start Recovery Year", "Status"];
  public submitted: boolean = false;

  constructor(public crudOperationsService: CrudOperationsService, public employeeMastersService: EmployeeMastersService, public fb: FormBuilder,
    private notification: NotifierService, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.fetchBranches();
  }
  public form = this.fb.group({
    finalSettlement: ["", Validators.required],
    relieveDate: ["", Validators.required],
  });

  get form_() { return this.form.controls; };


  fetchBranches() {
    this.spinner.show();
    this.employeeMastersService.getBranchMaster(this.companyId).subscribe((data: any) => {
      this.spinner.hide();
      this.branchData = data.data.content;
    },
      (error) => {
        this.spinner.hide();
      })
  }

  fetchDepartments() {
    this.employeeMastersService.getDepartmentListByBranchId(this.branchModel).subscribe((data: any) => {
      this.departmentData = data.data;
    })
  }

  fetchEmployees() {
    this.toggleScreen = true;
    let api: any = "leavemasterindividual/employee_dep_list_relieve/" + this.departmentModel + "/" + this.companyId;
    this.crudOperationsService.getList(api).subscribe((data: any) => {
      this.employeeList = data.data;
    })
  }

  getDepartment(data: any) {
    this.selectedDepartment = this.departmentModel;
  }

  editPromotion(data: any) {
    let api: any = "employee/" + data.employeeId;
    this.form.reset();
    this.relieveDate = data.relieveDate;
    this.finalSettlement = data.finalSettlement;
    this.empResgId = data.employeeResignationId;

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



  relieveEmployee(data: any) {



    this.submitted = true;
    if (this.form.valid) {
      this.relieveObject =
      {
        "finalSettlement": this.form.value.finalSettlement,
        "relieveDate": this.form.value.relieveDate,
      }

      let api: any = "leavemasterindividual/relieveEmployee/" + data.employeeId + "/" + this.empResgId;
      this.crudOperationsService.create(this.relieveObject, api).subscribe((resp: any) => {
        (<any>$('#promotions')).modal('hide');
        this.submitted = false;
        this.notification.notify('warning', data.message);
        this.fetchEmployees();

      })
    }
  }

  clearPromotion() {
    this.designationModel = "";
  }

  onHiringStartDateValueChange(event: any) {
    this.relieveDate = new Date(event);
  }


}
