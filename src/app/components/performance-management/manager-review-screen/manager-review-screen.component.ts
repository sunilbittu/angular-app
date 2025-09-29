import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';

@Component({
  selector: 'app-manager-review-screen',
  templateUrl: './manager-review-screen.component.html',
  styleUrls: ['./manager-review-screen.component.css']
})
export class ManagerReviewScreenComponent implements OnInit {

  public companyId = Number(sessionStorage.getItem("companyId"));
  public employeeId = Number(sessionStorage.getItem("empId"));
  public investmentYear: any = [];
  public myDate: any;
  public setupdatefalse: boolean = false;
  constructor(public crudOperationsService: CrudOperationsService, public datePipe: DatePipe, private spinner: NgxSpinnerService) { }
  public togglelist: boolean = true;
  public isnotFinalized: boolean = true;
  public kpaTableData: any = [];
  public employeeData: any = [];
  public yearModel: any = "";
  public Array: any = [];
  public employeeDetails: any = [];
  public toggleButton: boolean = true;
  public headers: any = ["Code", "Name", "Branch", "Department", "Designation", "Division", "Grade", "Category", "Project"];
  public toggleScreen: boolean = true;
  public employeeList: any = [];
  public managerName: any = '';
  public employeeRating: any;
  public remainingDay: any = 0;
  ngOnInit(): void {
    console.log("isnotFinalized", this.isnotFinalized)
    //emp list
    this.spinner.show();
    let url1 = "employeegoalsetting/employees_list_by_reporting_head/" + this.employeeId;
    this.crudOperationsService.getList(url1).subscribe((data: any) => {
      this.spinner.hide();
      this.employeeList = data.data;
    },
      (error) => {
        this.spinner.hide();
      })
    // fy
    let url = "financialyear/list-by/" + this.companyId;
    this.crudOperationsService.getList(url).subscribe((data: any) => {
      console.log(data);
      this.investmentYear = data.data.content;
    });
  }
  employeeClick(employee: any) {
    // (<any>$('#InvestmentDetails')).modal('show'); 
    console.log('aaaa', employee);
    this.employeeDetails = employee;
    this.toggleButton = false;

    //manager

    this.crudOperationsService.getList('employee/get_employee_reporting/' + this.employeeDetails.employeeId)
      .subscribe((data: any) => {
        this.managerName = data.data.firstName;
        console.log('data', this.managerName);

      });
  }
  checkAppraisal() {
    this.toggleScreen = false;
    console.log(this.employeeDetails)
  }
  getKpaList() {
    this.checkWeatherPMSFinalizedOrNot();
    console.log("isnotFinalized", this.isnotFinalized)

    //days 
    let url1 = "employeegoalsetting/employees_appraisal_remaining_days/" + this.employeeDetails.employeeId + "/" + Number(this.yearModel);
    this.crudOperationsService.getList(url1).subscribe((data: any) => {
      console.log('days', data);
      this.remainingDay = data.data;
    });

    let api1 = "employeegoalsetting/list_employee_financialyear/" + this.employeeDetails.employeeId + "/" + Number(this.yearModel);
    this.crudOperationsService.getList(api1).subscribe((data: any) => {

      this.kpaTableData = data.data;


    });
    let url = "employeeratingandscore/employee_rating_by_financialyear/" + this.employeeDetails.employeeId + "/" + Number(this.yearModel);
    this.crudOperationsService.getList(url).subscribe((data: any) => {
      console.log('aaaaa', data);
      this.employeeRating = data.data;
      this.discussionDuration = this.employeeRating.durationTime;
      if (this.discussionDuration != null) {
        this.setupdatefalse = true;
      }
      // this.discussionDuration=this.employeeRating.durationTime;
      this.discussionDate = this.datePipe.transform(this.employeeRating.durationDate, 'MM-dd-yyyy');
    });

  }
  public discussionDate: any = "";
  public discussionDuration: any = "";
  onDateValueChange(event: any) {
    this.discussionDate = this.datePipe.transform(event, 'dd-MM-yyyy');
  }
  public submitted: boolean = false;
  public RatingError: boolean = false;
  onSubmit(form: NgForm) {
    this.submitted = true;
    // alert(form.valid)
    if (form.valid) {

      let Array = [];
      for (let i = 0; i < this.kpaTableData.length; i++) {
        let obj: any = {};
        obj.employeeGoalSettingId = this.kpaTableData[i].employeeGoalSettingId;
        obj.appraisersComments = this.kpaTableData[i].appraisersComments;
        // obj.discussionDuration=Number(this.discussionDuration);
        // obj.discussionDate=this.discussionDate;
        obj.appraiserRating = this.kpaTableData[i].appraiserRating;
        obj.employee = { 'employeeId': this.employeeDetails.employeeId };
        obj.financialYear = { 'financialYearId': Number(this.yearModel) };
        // obj.kpaWeighttage=Number(this.kpaTableData[i].kpaWeighttage);
        obj.selfRating = this.kpaTableData[i].selfRating;
        Array.push(obj)
      }
      let Arr: any = [];
      let erroralert;
      erroralert = Array.some((value: any) => {
        return value.appraiserRating >= 5
      })
      console.log(this.kpaTableData)
      console.log('aa', Array);
      let saveApi = "employeegoalsetting/update_ratings?durationTime=" + this.discussionDuration + "&durationDate=" + this.discussionDate;
      this.crudOperationsService.create(Array, saveApi).subscribe((data) => {
        this.getKpaList();
        this.setupdatefalse = true;
        this.checkWeatherPMSFinalizedOrNot();
      });
    }
  }

  checkWeatherPMSFinalizedOrNot() {
    this.employeeId = Number(sessionStorage.getItem("empId"));
    let url = "employeeratingandscore/employee_rating_by_financialyear/" + this.employeeDetails.employeeId + "/" + Number(this.yearModel);
    this.crudOperationsService.getList(url).subscribe((data: any) => {
      if (data.data.isFinalized == true)
        this.isnotFinalized = false;
      console.log('aaaaa', data);

    });
  }
}
