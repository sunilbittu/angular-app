import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';
import { AddEmployeeService } from '../addEmplyee.service';
import {Sort} from '@angular/material/sort';
@Component({
  selector: 'app-employee-master',
  templateUrl: './employee-master.component.html',
  styleUrls: ['./employee-master.component.css']
})
export class EmployeeMasterComponent implements OnInit {
  public listOfEmployeeResults: any[] = [];
  public showSuccessMsg: boolean = false;
  public errorCount: any;
  public showErrorMsg: boolean = false;
  public successCount: any;

  constructor(public router: Router,
    private employeeService: AddEmployeeService, public crudOperationsService: CrudOperationsService,
    private notificationService: NotifierService, private spinner: NgxSpinnerService) { }
  public totalActiveEmployees: any;
  public totalResignEmployees: any;
  public totalSSNotFoundEmployees: any;
  public pageNumbers: any;
  public selectedPageNumber: number = 0;
  @Output() myOutput: EventEmitter<string> = new EventEmitter();
  outputMessage: string = "I am child component."
  public employeeList!: any[];
  public companyId: number = Number(sessionStorage.getItem('companyId'));
  public Subscription!: any;
  public employeeData!: any;
  public cancelClicked: any;
  public headers: any = ["Employee Id", "Employee Code", "Employee Name", "Branch", "Department", "Designation", "Division", "Grade", "Category", "Project", "Action"];
  public popoverTitle = 'Delete Confirmation';
  public popoverMessage = 'Are you sure you want delete';
  public empData: any = {};
  public reportingHeadObj: any = {};
  public searchModel = '';
  public sortedData: any=[];
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
  public showEmployeeDetails: boolean = false;

  public role = sessionStorage.getItem("role");

  ngOnInit(): void {
    this.getAllEmployees()
    this.fetchTotalActiveEmployee();
    this.fetchTotalResignEmployee();
    this.fetchSSNotFoundEmployees();
  }
  sortData(sort: Sort) {
    this.sortedData=this.crudOperationsService.sortData(sort,this.employeeList);
         
  }
  fetchTotalActiveEmployee() {
    this.spinner.show();
    let api: any = 'dashboard/count_active_employee_total/' + sessionStorage.getItem("companyId");
    this.crudOperationsService.getList(api).subscribe((data: any) => {
      this.spinner.hide();
      this.totalActiveEmployees = data.data;
      console.log("===================" + this.totalActiveEmployees);
    })
  }
  fetchTotalResignEmployee() {
    this.spinner.show();
    let api: any = 'employee/count_resign_employee_total/' + sessionStorage.getItem("companyId");
    this.crudOperationsService.getList(api).subscribe((data: any) => {
      this.spinner.hide();
      this.totalResignEmployees = data.data;
    })
  }

  fetchSSNotFoundEmployees() {
    this.spinner.show();
    let api: any = 'employee/ss_not_found_employees_count/' + sessionStorage.getItem("companyId");
    this.crudOperationsService.getList(api).subscribe((data: any) => {
      this.spinner.hide();
      this.totalSSNotFoundEmployees = data.data;
    })
  }
  addEmployee() {
    // this.router.relativeLinkResolution('Master/add-employee')
    this.router.navigateByUrl('HRMS/Master/add-employee');
  }
  viewEmployee(id: number, dept: string) {
    sessionStorage.setItem('Edit-employeeId', id.toString());
    sessionStorage.setItem('Edit-employee-role', dept);
    this.myOutput.emit(this.outputMessage);
    this.router.navigateByUrl('HRMS/Master/view-employee/' + id + '');
  }
  getAllEmployees() {

    if (sessionStorage.getItem("employeeMasterType") == "Male") {
      this.spinner.show();
      this.searchModel = "male";
      let url = 'employee/search-list/' + this.companyId + '?search=' + this.searchModel + '&page=' + this.pageNumber + '&size=20';
      this.crudOperationsService.getList(url)
        .subscribe((data: any) => {

          this.employeeList = data.data.content;
          this.sortedData=data.data.content;

          this.spinner.hide();
          //pagination call
          this.handlePagination(data);
        },
          (error) => {
            this.spinner.hide();
            console.log(error);
          })
      sessionStorage.setItem('employeeMasterType', "All");
    } else if (sessionStorage.getItem("employeeMasterType") == "Female") {
      this.spinner.show();
      this.searchModel = "female";
      let url = 'employee/search-list/' + this.companyId + '?search=' + this.searchModel + '&page=' + this.pageNumber + '&size=20';
      this.crudOperationsService.getList(url)
        .subscribe((data: any) => {

          this.employeeList = data.data.content;
          this.sortedData=data.data.content;
          this.spinner.hide();
          //pagination call
          this.handlePagination(data);
        },
          (error) => {
            this.spinner.hide();
            console.log(error);
          })
      sessionStorage.setItem('employeeMasterType', "All");

    } else {
      this.spinner.show();
      let url = 'employee/search-list/' + this.companyId + '?search=' + this.searchModel + '&page=' + this.pageNumber + '&size=20';
      this.crudOperationsService.getList(url)
        .subscribe((data: any) => {

          this.employeeList = data.data.content;
          this.sortedData=data.data.content;
          this.spinner.hide();
          //pagination call
          this.handlePagination(data);
        },
          (error) => {
            this.spinner.hide();
            console.log(error);
          })

    }
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
  deleteEmployeeById(id: number) {
    //show spinner
    this.spinner.show();
    let api: any = 'employee/' + id;
    this.crudOperationsService.delete(api).subscribe((data: any) => {
      this.totalResignEmployees = data.data;
      this.notificationService.notify('success', data.message);
      this.getAllEmployees();
      //show hide
      this.spinner.hide();
    },
      (error) => {
        console.log(error);
        this.notificationService.notify('error', 'Something Went Wrong');
        //show hide
        this.spinner.hide();
      })
  }
  pageChange(id: number) {
    //alert(id);
    this.selectedPageNumber = id;
    let api: any = "employee/list_company/" + this.companyId
    this.crudOperationsService.getPaginationList(api, id)
      .subscribe((data: any) => {
        this.employeeList = data.data.content;
      })
  }
  //nextPage click
  nextPage() {
    //alert(this.selectedPageNumber);
    let page = this.selectedPageNumber + 1;
    let api: any = "employee/list_company/" + this.companyId
    this.crudOperationsService.getPaginationList(api, page)
      .subscribe((data: any) => {
        this.employeeList = data.data.content;
      })
  }
  //previous function
  previousPage() {
    let page = this.selectedPageNumber - 1;
    let api: any = "employee/list_company/" + this.companyId + "/?page=" + page
    this.crudOperationsService.getList(api)
      .subscribe((data: any) => {
        this.employeeList = data.data.content;
      })
  }
  getEmployeeDetailsById(id: number) {
    this.showEmployeeDetails = true;
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
  public importFileData: any = null;

  importFile(event: any) {
    if (event.target.files && event.target.files[0]) {
      console.log(event.target.files[0].type);

      if (event.target.files[0].type == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
        this.importFileData = event.target.files[0];
      }
    } else {

    }

  }

  submitImport() {
    if (this.importFileData != null) {
      let compId: any = sessionStorage.getItem('companyId');
      let form = new FormData();
      form.append("file", this.importFileData);
      form.append("companyId", compId);

      let api: any = "employee/employeeImport";
      this.crudOperationsService.create(form, api).subscribe((data: any) => {
        console.log(data)
        this.listOfEmployeeResults = [];
        this.listOfEmployeeResults = data.data;
        this.successCount = (this.listOfEmployeeResults[(this.listOfEmployeeResults.length - 1)])["importSucessCount"];
        this.errorCount = (this.listOfEmployeeResults[(this.listOfEmployeeResults.length - 1)])["importErrorCount"];
        console.log(this.successCount);
        console.log(this.errorCount);
        if (this.successCount > 0) {
          this.showSuccessMsg = true;

        }
        if (this.errorCount > 0) {
          this.showErrorMsg = true;
        }
      })
    }
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
}
