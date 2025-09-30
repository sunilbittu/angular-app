import { Component, OnInit } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';

@Component({
  selector: 'app-manager-review-menu',
  templateUrl: './manager-review-menu.component.html',
  styleUrls: ['./manager-review-menu.component.css']
})
export class ManagerReviewMenuComponent implements OnInit {

  constructor(public crudOperationsService: CrudOperationsService, private notification: NotifierService, private spinner: NgxSpinnerService) { }
  public managerName: any = '';
  public employeeData: any;
  public investmentYear: any = [];
  public yearModel: any = "";
  public employeeId: any = Number(sessionStorage.getItem("empId"));
  public companyId: any = Number(sessionStorage.getItem("companyId"));
  public menuData: any = [];
  public employeeList: any = [];
  public remainingDay: any = 0;
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
      console.log("employee", data);
      this.employeeData = data.data;

    });
    // fy
    let url = "financialyear/list-by/" + this.companyId;
    this.crudOperationsService.getList(url).subscribe((data: any) => {
      console.log(data);
      this.investmentYear = data.data.content;
    });
  }
  getmenuList() {

    let api = "employeegoalsetting/employees_by_grades_for_manager/" + this.employeeId + "/" + Number(this.yearModel);
    this.crudOperationsService.getList(api).subscribe((data: any) => {
      this.menuData = data.data.gradesWiseRatingDTO;
      console.log(data);

    });

    let api1 = "employeegoalsetting/employees_list_by_manager/" + this.employeeId + "/" + Number(this.yearModel);
    this.crudOperationsService.getList(api1).subscribe((data: any) => {
      // this.menuData = data.data.gradesWiseRatingDTO;
      console.log('aa', data);
      this.employeeList = data.data;
      //days 
      let url1 = "employeegoalsetting/employees_appraisal_remaining_days/" + this.employeeList[0].employeeId + "/" + Number(this.yearModel);
      this.crudOperationsService.getList(url1).subscribe((data: any) => {
        console.log('days', data);
        this.remainingDay = data.data;
      });
    });
  }
  changeReview(id: any, empRating: any, managerRating: any) {
    let ratings = ["S", "M", "A", "R", "T"];
    if (ratings.indexOf(empRating) == -1 || ratings.indexOf(managerRating) == -1) {
      this.notification.notify('error', 'Manager Review is not completed');
    } else {
      let url = "employeegoalsetting/manager_updation_on_employee_appriasal/" + id + "/" + Number(this.yearModel) + "?managerReviewStatus=Reviewed";
      this.crudOperationsService.update("", url).subscribe((data: any) => {
        this.getmenuList();
      });
    }
  }
}
