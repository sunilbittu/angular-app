import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';

@Component({
  selector: 'app-employee-appraisal',
  templateUrl: './employee-appraisal.component.html',
  styleUrls: ['./employee-appraisal.component.css']
})
export class EmployeeAppraisalComponent implements OnInit {

  public companyId = Number(sessionStorage.getItem("companyId"));
  public employeeId = Number(sessionStorage.getItem("empId"));
  public investmentYear: any = [];
  public isnotFinalized: boolean = true;
  public kpaTableData2: any;
  public setfinalizedfordisplay: boolean = true;
  public showRatingsTable: boolean = false;
  constructor(public crudOperationsService: CrudOperationsService, private spinner: NgxSpinnerService) { }
  public togglelist: boolean = true;
  public kpaTableData: any = [];
  public employeeData: any = [];
  public yearModel: any = "";
  public selfRating: any = "";
  public Array: any = [];
  public managerName: any = "";
  public employeeRating: any = "";
  public remainingDay: any = 0;
  public setupdatefalse: boolean = false;

  ngOnInit(): void {
    //manager
    this.spinner.show();
    this.crudOperationsService.getList('employee/get_employee_reporting/' + Number(sessionStorage.getItem('empId')))
      .subscribe((data: any) => {
        this.spinner.hide();
        this.managerName = data.data.firstName;
      },
        (error) => {
          this.spinner.hide();
        })
    let empUrl = "employee/" + this.employeeId;
    this.crudOperationsService.getList(empUrl).subscribe((data: any) => {
      if (data)
        this.employeeData = data.data;

    });
    // fy
    let url = "financialyear/list-by/" + this.companyId;
    this.crudOperationsService.getList(url).subscribe((data: any) => {
      console.log(data);
      this.investmentYear = data.data.content;
    });
    // 

  }
  getKpaList() {

    this.checkWeatherPMSFinalizedOrNot();

    let api1 = "employeegoalsetting/list_employee_financialyear/" + this.employeeId + "/" + Number(this.yearModel);
    this.crudOperationsService.getList(api1).subscribe((data: any) => {

      this.kpaTableData = data.data;


    });

    let url = "employeeratingandscore/employee_rating_by_financialyear/" + this.employeeId + "/" + Number(this.yearModel);
    this.crudOperationsService.getList(url).subscribe((data: any) => {
      console.log('aaaaa', data);
      this.employeeRating = data.data;
      if (this.employeeRating.employeeRating != null) {
        this.setupdatefalse = true;
      }
    });
    //days
    let url1 = "employeegoalsetting/employees_appraisal_remaining_days/" + this.employeeId + "/" + Number(this.yearModel);
    this.crudOperationsService.getList(url1).subscribe((data: any) => {
      console.log('days', data);
      // this.employeeRating=data.data;
      this.remainingDay = data.data;
    });
  }

  public submitted: boolean = false;
  onSubmit(form: NgForm) {
    var toggleSelfRating = true;
    this.kpaTableData.forEach((element: any) => {
      if (element.selfRating > 5) {
        toggleSelfRating = false;

      }
      // else{
      //   toggleSelfRating=true;

      // }

    });
    this.submitted = true;
    if (form.valid && toggleSelfRating) {
      let Array1 = [];
      for (let i = 0; i < this.kpaTableData.length; i++) {
        let obj: any = {};
        obj.employeeGoalSettingId = this.kpaTableData[i].employeeGoalSettingId;
        obj.employee = { 'employeeId': this.employeeId };
        obj.financialYear = { 'financialYearId': Number(this.yearModel) };
        obj.selfRating = this.kpaTableData[i].selfRating;
        Array1.push(obj)
        console.log('aerre', Array1)
      }
      console.log('aa', Array1);
      let saveApi = "employeegoalsetting/update_ratings";
      this.crudOperationsService.create(Array1, saveApi).subscribe((data) => {
        this.getKpaList();
        this.submitted = false;
        this.checkWeatherPMSFinalizedOrNot();
      });

    }

  }

  checkWeatherPMSFinalizedOrNot() {
    this.employeeId = Number(sessionStorage.getItem("empId"));
    let url = "employeeratingandscore/employee_rating_by_financialyear/" + this.employeeId + "/" + Number(this.yearModel);
    this.crudOperationsService.getList(url).subscribe((data: any) => {
      this.showRatingsTable = true;
      this.kpaTableData2 = data.data;
      if (this.kpaTableData2.isFinalized == null) {
        this.setfinalizedfordisplay = false;
      } else {
        this.setfinalizedfordisplay = this.kpaTableData2.isFinalized;
      }
      if (data.data.isFinalized == true)
        this.isnotFinalized = false;
      console.log('bbbbbb', this.kpaTableData2);

    });
  }

}
