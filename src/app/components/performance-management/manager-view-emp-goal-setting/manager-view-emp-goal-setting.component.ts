import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';
import { AddEmployeeService } from '../../../components/master/addEmplyee.service';

@Component({
  selector: 'app-manager-view-emp-goal-setting',
  templateUrl: './manager-view-emp-goal-setting.component.html',
  styleUrls: ['./manager-view-emp-goal-setting.component.css']
})
export class ManagerViewEmpGoalSettingComponent implements OnInit {

  constructor(public router: Router, private employeeService: AddEmployeeService,
    private crudOperationsService: CrudOperationsService, private spinner: NgxSpinnerService) { }

  public employeeList!: any[];
  public empId!: number;
  public Subscription!: any;
  public employeeData!: any;
  p: number = 1;
  //pagination
  public pageNumber: Number = 0;
  public showNumber: any;
  public numberOfElements: any;
  public params: any;
  itemsPerPage: any;
  totalItems: any;
  currentPage: any;
  totalElements: number = 0;

  public headers: any = ["Code", "Name", "Branch", "Department", "Designation", "Category", "Project", "Goal Setting Status", "Previous Year Goals", "Action"];

  ngOnInit(): void {

    this.getAllEmployees()

  }
  getAllEmployees() {
    this.spinner.show();
    //get companyId from sessionStorage
    this.empId = Number(sessionStorage.getItem('empId'));

    let api: any = "employee/findEmployeeListByManager?page=0&employeeId=" + this.empId + "&size=10";

    this.crudOperationsService.getList(api)
      .subscribe((data: any) => {
        this.spinner.hide();
        this.employeeList = data.data.content
        //pagination properties
        this.showNumber = (data.data.number) * 10;
        this.numberOfElements = data.data.totalElements;
        this.totalElements = data.data.totalElements;
        this.itemsPerPage = 10;
        this.currentPage = data.data.pageable.pageNumber + 1;
        this.totalItems = (data.data.totalPages) * this.itemsPerPage;
      },

        (error) => {
          this.spinner.hide();
          console.log(error);
        })
  }

  viewEmployee(id: string) {
    //this.router.navigateByUrl('HRMS/Master/view-employee/'+id+'');
    sessionStorage.setItem("review", "true");
    sessionStorage.setItem("reviewemp", id);
    this.router.navigateByUrl('HRMS/performance-management/emp-goal-settings');
  }
  getEmployeeListBySearchParam($event: any) {
    const param = $event.target.value;

    if (param.trim() == "") {
      //geting agents list
      this.getAllEmployees();
    }

    else {
      //alert($event.target.value);


      this.params = "?page=" + this.pageNumber + "&employeeId=" + this.empId + "&employeeCode=" + param + "&size=10"

      let api: any = "employee/findEmployeeListByManager" + this.params;

      this.crudOperationsService.getList(api)
        .subscribe((data: any) => {
          this.employeeList = data.data.content

          //pagination properties
          this.showNumber = (data.data.number) * 10;
          this.numberOfElements = data.data.totalElements;
          this.totalElements = data.data.totalElements;
          this.itemsPerPage = 10;
          this.currentPage = data.data.pageable.pageNumber + 1;
          this.totalItems = (data.data.totalPages) * this.itemsPerPage;

          //spinner hide
          //this.spinner.hide();

        },
          (error) => {

            console.log(error);

            //spinner hide
            //this.spinner.hide();




          })


    }




  }



}
