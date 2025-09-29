import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';
import { AddEmployeeService } from '../../master/addEmplyee.service';

@Component({
  selector: 'app-todays-leave-employee',
  templateUrl: './todays-leave-employee.component.html',
  styleUrls: ['./todays-leave-employee.component.css']
})
export class TodaysLeaveEmployeeComponent implements OnInit {

  constructor(public router: Router,
    private employeeService: AddEmployeeService, public crudOperationsService: CrudOperationsService,
    private notificationService: NotifierService, private spinner: NgxSpinnerService) { }
  public totalActiveEmployees: any;
  public totalResignEmployees: any;
  public pageNumbers: any;
  public selectedPageNumber: number = 0;
  public employeeList!: any[];
  public companyId: number = Number(sessionStorage.getItem('companyId'));
  public employeeData!: any;
  public headers: any = ["Employee Id", "Employee Code", "Employee Name", "Branch", "Department", "Designation", "Division", "Grade", "Category", "Project", "Action"];
  public empData: any = {};
  public reportingHeadObj: any = {};
  public searchModel = '';
  p: number = 1;
  toggleLoader: boolean = false;
  //pagination
  itemsPerPage: any = 20;
  totalItems: any;
  currentPage: any;
  totalElements: number = 0;
  showingFrom: number = 0;
  showingTo: number = 0;
  public pageNumber: Number = 0;
  ngOnInit(): void {
    this.getAllEmployees();
  }

  getAllEmployees() {
    //show spinner
    this.spinner.show();
    let url = 'employee/employeeOnTodaysLeave/' + this.companyId + '?search=' + this.searchModel + '&page=' + this.pageNumber + '&size=20';
    this.crudOperationsService.getList(url)
      .subscribe((data: any) => {
        this.employeeList = data.data.content;
        this.spinner.hide();
        //pagination call
        this.handlePagination(data);
      },
        (error) => {
          this.spinner.hide();
          console.log(error);
        })
  }
  handlePagination(data: any) {
    this.totalElements = data.data.totalElements;
    this.itemsPerPage = 20;
    this.currentPage = data.data.pageable.pageNumber + 1;
    this.totalItems = (data.data.totalPages) * this.itemsPerPage;
    this.showingFrom = (data.data.pageable.pageNumber * this.itemsPerPage) + 1;
    const to = (data.data.pageable.pageNumber + 1) * this.itemsPerPage;
    if (this.totalElements >= to) {
      this.showingTo = to;
    } else {
      this.showingTo = this.totalElements;
    }
  }
  pageChanged(event: any) {
    this.pageNumber = event - 1;
    this.getAllEmployees();
  }

  getEmployeeDetailsById(id: number) {
    //calling spinner
    this.spinner.show();
    this.employeeService.getEmployeeById(id)
      .subscribe((data: any) => {
        this.spinner.hide();
        this.empData = data.data;
        this.getReportingEmployeesById(this.empData.reportingHeadId);
      },
        (error) => {
          this.notificationService.notify('error', 'Something Went Wrong');
          this.spinner.hide();
        })
  }

  getReportingEmployeesById(reportingHeadId: number) {
    this.reportingHeadObj = {};
    this.spinner.show();
    let api = 'employee/get_employee_reporting/' + reportingHeadId;
    this.crudOperationsService.getList(api)
      .subscribe((data: any) => {
        this.spinner.hide();
        this.reportingHeadObj = data.data;
      },
        (error) => {
          this.notificationService.notify('error', 'Something Went Wrong');
          this.spinner.hide();
        })
  }
}
