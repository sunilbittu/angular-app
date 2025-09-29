import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';
import { AddEmployeeService } from '../../master/addEmplyee.service';

@Component({
  selector: 'app-employee-lock-unlock',
  templateUrl: './employee-lock-unlock.component.html',
  styleUrls: ['./employee-lock-unlock.component.css']
})
export class EmployeeLockUnlockComponent implements OnInit {
  public totalActiveEmployees: any;
  public totalResignEmployees: any;
  public pageNumbers: any;
  public selectedPageNumber: number = 0;
  public employeeList!: any[];
  public companyId: number = Number(sessionStorage.getItem('companyId'));
  public Subscription!: any;
  public employeeData!: any;
  public cancelClicked: any;
  public headers: any = ["Employee Id", "Employee Code", "Employee Name", "Branch", "Department", "Designation", "Division", "Grade", "Category", "Project", "Action"];
  public popoverTitle = 'Employee Lock Confirmation';
  public unlockpopoverTitle = 'Employee Un Lock Confirmation';
  public popoverMessage = 'Are you sure you want lock the Employee';
  public unlockpopoverMessage = 'Are you sure you want un lock the Employee';
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

  constructor(private formBuilder: FormBuilder, public router: Router,
    private employeeService: AddEmployeeService, public crudOperationsService: CrudOperationsService,
    private notificationService: NotifierService, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.getAllEmployees();

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

  pageChanged(event: any) {
    this.pageNumber = event - 1;
    this.getAllEmployees();
  }

  getAllEmployees() {
    //show spinner
    this.spinner.show();

    if(sessionStorage.getItem("employeeMasterType")=="Male"){
      this.searchModel = "male";
      let url = 'employee/search-list1/' + this.companyId + '?search=' + this.searchModel + '&page=' + this.pageNumber + '&size=20';
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
        sessionStorage.setItem('employeeMasterType', "All");
    }else if(sessionStorage.getItem("employeeMasterType")=="Female"){
      this.searchModel = "female";
      let url = 'employee/search-list1/' + this.companyId + '?search=' + this.searchModel + '&page=' + this.pageNumber + '&size=20';
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
        sessionStorage.setItem('employeeMasterType', "All");
    
    }else{

      let url = 'employee/search-list1/' + this.companyId + '?search=' + this.searchModel + '&page=' + this.pageNumber + '&size=20';
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

    
  }

  resetEmployeePassword(data:any){
   
      let api:any="employee/employee_lock/"+this.companyId+"/"+data.employeeId;
      this.crudOperationsService.getList(api).subscribe((resp: any) => {
          //console.log("lock successfull")  
          this.getAllEmployees();  
          this.notificationService.notify('success', "Employee lock successful");
          
      })
      
    }

    unlockEmployee(data:any){
   
      let api:any="employee/employee_un_lock/"+this.companyId+"/"+data.employeeId;
      this.crudOperationsService.getList(api).subscribe((resp: any) => {
          //console.log("lock successfull")  
          this.getAllEmployees();  
          this.notificationService.notify('success', "Employee un lock successful");
          
      })
      
    }

}
