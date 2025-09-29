import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';
import { EmployeeMastersService } from '../../master/employee.masters.service';

@Component({
  selector: 'app-hr-team-appraisal-status',
  templateUrl: './hr-team-appraisal-status.component.html',
  styleUrls: ['./hr-team-appraisal-status.component.css']
})
export class HrTeamAppraisalStatusComponent implements OnInit {

  public companyId = Number(sessionStorage.getItem("companyId"));
  public FinancialYearData: any;
  public selectedFinancialYear: any;
  public financialYearModel: any;
  public departmentData: any;
  public selectedDepartment: any;
  public departmentModel: any;
  public toggleScreen: boolean = false;
  public headers2: any = ["Code", "Name", "Department", "Branch", "Designation", "Grade", "Category", "Project", "Increment(%)", "Action"];
  public headers5: any = ["Code", "Name", "Department", "Branch", "Designation", "Grade", "Category", "Project"];
  public headers3: any = ["Key Performance Area", "Weightage (%)", "Results Achived", "Appraiser Rating", "Department Head Rating", "Department Head Finalized"]
  public headers4: any = ["Grade", "No of Employees", "S", "M", "A", "R", "T"]
  public totalEmployeesInDepartment: any;
  public employeeRatingData: any;
  public employeeSelfAppraisal: any;
  public employeeSelfAppraisalCount: any;
  public employeeAppraisalCount: any;
  public employeefinalizedCount: any;
  public employeeList: any;
  public employeeKpaList: any;
  public toggleScreen2: boolean = false;
  public gradeEmployeeCount: any;
  public selectedDepartmentName: any;
  public editIncrement: boolean = false;
  public multipleIncrement: boolean = false;
  public employeeList3: any;
  public toggleScreen3: boolean = false;
  public selectedGrade: any;
  public highlightedrow: any;

  constructor(public crudOperationsService: CrudOperationsService, private spinner: NgxSpinnerService,
    public employeeMastersService: EmployeeMastersService) { }

  ngOnInit(): void {
    this.fetchFinancialYear();
    this.fetchDepartments();
  }


  fetchFinancialYear() {
    this.spinner.show();
    let url = "financialyear/list-by/" + this.companyId;
    this.crudOperationsService.getList(url).subscribe((data: any) => {
      this.spinner.hide();
      this.FinancialYearData = data.data.content;
    },
      (error) => {
        this.spinner.hide();
      })
  }

  fetchDepartments() {
    this.employeeMastersService.getDepartmentList(this.companyId).subscribe((data: any) => {
      this.departmentData = data.data.content;
    })
  }

  getFinancialYear() {
    this.selectedFinancialYear = this.financialYearModel;
  };

  getDepartment(data: any) {
    this.selectedDepartment = this.departmentModel;
  }

  getEmployees() {
    this.toggleScreen = true;

    // let api = "employee/list_employee_department/" + this.companyId + "/" + this.selectedDepartment;
    // this.crudOperationsService.getList(api).subscribe((response: any) => {
    //   this.employeeList = response.data;
    // });

    let api4 = "deptheadreview/count_rating_dept_grage/" + this.companyId + "/" + this.selectedDepartment + "/" + this.selectedFinancialYear;
    this.crudOperationsService.getList(api4).subscribe((response: any) => {
      this.gradeEmployeeCount = response.data;

    })

    let api2 = "deptheadreview/fetch-emp-details_count/" + this.companyId + "/" + this.selectedDepartment + "/" + this.selectedFinancialYear;
    this.crudOperationsService.getList(api2).subscribe((response: any) => {
      this.employeeRatingData = response.data;

      this.employeeSelfAppraisalCount = response.data.totalNoOfEmpsSelfRating;
      this.employeeAppraisalCount = response.data.totalNoOfEmpsAppraiserRating;
      this.employeefinalizedCount = response.data.totalNoOfEmpsDeptHeadFinalized;
      this.totalEmployeesInDepartment = response.data.employeesINDepartment;


    })
  }

  employeeViewClick(data: any) {


    let api3 = "employeegoalsetting/list_employee_financialyear_2/" + data.employeeId + "/" + this.selectedFinancialYear;
    this.crudOperationsService.getList(api3).subscribe((response: any) => {
      this.employeeKpaList = response.data;
    })
  }

  clearData() {
    this.selectedFinancialYear = "";
    this.selectedDepartment = "";
    this.toggleScreen = false;
    this.financialYearModel = "";
    this.departmentModel = "";
  }

  backToFirstPage() {
    this.cancelEditIncrement();
    this.toggleScreen2 = false;
    this.toggleScreen3 = false;
    this.toggleScreen = true;
    this.employeeList = "";
    this.editIncrement = false;
    this.multipleIncrement = false;

  }

  totalemployeesInGrade(data: any) {
    this.toggleScreen3 = true;
    this.toggleScreen = false;
    let api5 = "employee/list_employee_department/" + this.companyId + "/" + this.selectedDepartment + "/" + data.gradeId;
    this.crudOperationsService.getList(api5).subscribe((response: any) => {
      this.employeeList3 = response.data;

    })
  }

  totalemployeesInGradeS(data: any) {
    this.toggleScreen2 = true;
    this.toggleScreen = false;


    let api5 = "employeeratingandscore/list_dep_grade_rating/" + this.companyId + "/" + this.selectedDepartment + "/" + this.selectedFinancialYear + "/" + data.gradeId + "/S";
    this.crudOperationsService.getList(api5).subscribe((response: any) => {
      this.employeeList = response.data;
    })
  }

  totalemployeesInGradeM(data: any) {
    this.toggleScreen2 = true;
    this.toggleScreen = false;
    let api6 = "employeeratingandscore/list_dep_grade_rating/" + this.companyId + "/" + this.selectedDepartment + "/" + this.selectedFinancialYear + "/" + data.gradeId + "/M";
    this.crudOperationsService.getList(api6).subscribe((response: any) => {
      this.employeeList = response.data;
    })
  }

  totalemployeesInGradeA(data: any) {
    this.toggleScreen2 = true;
    this.toggleScreen = false;
    let api7 = "employeeratingandscore/list_dep_grade_rating/" + this.companyId + "/" + this.selectedDepartment + "/" + this.selectedFinancialYear + "/" + data.gradeId + "/A";
    this.crudOperationsService.getList(api7).subscribe((response: any) => {
      this.employeeList = response.data;
    })
  }

  totalemployeesInGradeR(data: any) {
    this.toggleScreen2 = true;
    this.toggleScreen = false;
    let api8 = "employeeratingandscore/list_dep_grade_rating/" + this.companyId + "/" + this.selectedDepartment + "/" + this.selectedFinancialYear + "/" + data.gradeId + "/R";
    this.crudOperationsService.getList(api8).subscribe((response: any) => {
      this.employeeList = response.data;
    })
  }

  totalemployeesInGradeT(data: any) {
    this.selectedGrade = data.gradeId;
    this.toggleScreen2 = true;
    this.toggleScreen = false;
    let api9 = "employeeratingandscore/list_dep_grade_rating/" + this.companyId + "/" + this.selectedDepartment + "/" + this.selectedFinancialYear + "/" + data.gradeId + "/T";
    this.crudOperationsService.getList(api9).subscribe((response: any) => {
      this.employeeList = response.data;
    })
  }
  incrementEmployee(data: any) {
    this.highlightedrow = data;
    this.editIncrement = true;
    this.multipleIncrement = false;
  }
  cancelEditIncrement() {
    this.editIncrement = false;
  }
  updateIncrement(data: any) {
    let object: any = {
      "employeeId": data.employeeId,
      "increment": data.increment,
      "financialYearId": Number(this.financialYearModel)
    }
    let api10 = "employeeratingandscore/incrementPercentage";
    this.crudOperationsService.create(object, api10).subscribe((response: any) => {
      console.log("=='", response.data, "'==")
      if (response.data.false == null) {
        alert("Please check the salary mapping of the employee ")
        this.backToFirstPage();

      } else {
        this.multipleIncrement = false;
        this.editIncrement = false;
        switch (this.selectedGrade) {
          case "S":
            this.totalemployeesInGradeS(this.selectedGrade);
            break;
          case "M":
            this.totalemployeesInGradeM(this.selectedGrade);

            break;
          case "A":
            this.totalemployeesInGradeA(this.selectedGrade);
            break;
          case "R":
            this.totalemployeesInGradeR(this.selectedGrade);
            break;
          case "T":
            this.totalemployeesInGradeT(this.selectedGrade);
            break;
        }
      }



    })
  }

  // editMultipleIncrement(){
  //   this.incrementEmployee();
  //   this.multipleIncrement=true;
  // }

  // updateMultipleIncrement(){
  //   console.log(this.employeeList)
  //   let api11 ="employeeratingandscore/multipleincrementPercentage/"+this.financialYearModel;
  //   this.crudOperationsService.create(this.employeeList,api11).subscribe((response: any) => {
  //     console.log(response)
  //     this.multipleIncrement=false;
  //     this.editIncrement=false;
  //     switch (this.selectedGrade) {
  //       case "S":
  //        this.totalemployeesInGradeS(this.selectedGrade);
  //         break;
  //       case "M":
  //        this.totalemployeesInGradeM(this.selectedGrade);

  //         break;
  //       case "A":
  //        this.totalemployeesInGradeA(this.selectedGrade);
  //         break;
  //       case "R":
  //        this.totalemployeesInGradeR(this.selectedGrade);
  //         break;
  //       case "T":
  //        this.totalemployeesInGradeT(this.selectedGrade);
  //         break;
  //     }
  //   })
  // }

  cancelMultipleIncrement() {
    this.multipleIncrement = false;
    this.editIncrement = false;
  }

}
