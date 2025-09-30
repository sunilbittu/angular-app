import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';

@Component({
  selector: 'app-leave-master-indivisual',
  templateUrl: './leave-master-indivisual.component.html',
  styleUrls: ['./leave-master-indivisual.component.css']
})
export class LeaveMasterIndivisualComponent implements OnInit {

  constructor(public crudOperationsService: CrudOperationsService, private spinner: NgxSpinnerService,
    private notification: NotifierService) { }

  public headers: any = ["Code", "Name", "Branch", "Department", "Designation", "Grade", "Category", "Division"];
  public leaveYear: any = [];
  public viewLeavestbl: boolean = false;
  public advanceLeaves: boolean = false;
  public leaveYearValidation:boolean = false;
  public requiredErrorText = 'can\'t be blank';
  public leaveHeader: any = [];
  public yearModel: any = "";
  public leaveData: any = [
    { head: 'OPENING' },
    { head: 'CURRENT' }
  ];
  
  public epmloyeeList: any = [];
  public companyId: number = Number(sessionStorage.getItem('companyId'));
  public searchModel = '';
  public empId: any;
  public empCode: any;
  public empName: any;
  public list1: any = [];
  public list2: any = [];
  public openingBal: any;
  public leaveMasterIndividualId: any;
  public leavesList: any = [];
  public openingModel: any;
  public highlightRow!: any;
  public checked: any = true;
  public p: number = 1;

  ngOnInit(): void {
    this.getLeaveYearList();
    this.spinner.show();
    this.crudOperationsService.getList('employee/emp_list_company_leave/' + Number(sessionStorage.getItem('companyId'))).subscribe((data: any) => {
      this.spinner.hide();
      this.epmloyeeList = data.data.content;
    },
      (error) => {
        this.spinner.hide();
        this.notification.notify('error', 'Something Went Wrong');
      });
  }
  public getLeaveYearList() {
    this.spinner.show();
    let api = 'leaveyear/list/' + this.companyId + '?page=0&size=100';
    this.crudOperationsService.getList(api).subscribe((data: any) => {
      this.spinner.hide();
      this.leaveYear = data.data.content;
    },
      (error) => {
        this.spinner.hide();
        console.log(error);
      })
  }
  leaveYearChange(){
   // alert("hi")
    if(this.yearModel == ""){
      this.leaveYearValidation = true;
    }else{
      this.leaveYearValidation = false;
    }
  }
  ViewLeaves(id: any, index: Number, firstName: any, lastName: any) {
    if(this.yearModel == ""){
      this.leaveYearValidation = true;
    }else{
      this.spinner.show();
      this.viewLeavestbl = false;
      this.empId = id;
      this.highlightRow = index;
      this.crudOperationsService.getList('leavemasterindividual/list_by_employee_individual/' + this.empId + '/' + this.yearModel).subscribe((data: any) => {
        this.spinner.hide();
        if (data.data == null) {
          this.notification.notify('warning', 'Warning! Leaves not assigned to employee ' + firstName + ' ' + lastName + ' for Leave year ' + this.yearModel);
        } else {
          this.viewLeavestbl = true;
          this.leavesList = data.data.leaveTypeInfo;
          this.empCode = data.data.employee.employeeCode;
          this.empName = data.data.employee.firstName+" "+data.data.employee.lastName;
          this.leaveMasterIndividualId = data.data.leaveMasterIndividualId;
          this.advanceLeaves = data.data.isAdvacnce;
          window.scrollTo(0, document.body.scrollHeight + 2);
        }
      });
  
    }

  }
  checkCheckBoxvalue(event:any){
    this.advanceLeaves = event.target.checked;
   
   }
  updateLeaves() {
    if (this.leaveMasterIndividualId) {
      this.spinner.show();
      let obj = {
        employee: { employeeId: this.empId },
        leaveTypeInfo: this.leavesList,
        isAdvacnce:this.advanceLeaves
      }
      this.crudOperationsService.update(obj, 'leavemasterindividual/' + this.leaveMasterIndividualId).subscribe((data: any) => {
        this.spinner.hide();
        this.viewLeavestbl = false;
        window.scroll(0, 0);
        this.highlightRow = undefined;
        this.notification.notify('success', 'Leaves updated successfully!');
      },
        (error) => {
          this.spinner.hide();
          this.notification.notify('error', 'Something Went Wrong');
        });
    }
  }
  updateOpening() {
    let obj1 = {
      // "leaveMasterIndividualId":113,
      "employee": { "employeeId": 2 }, "opening": this.list1,
      "isAdvacnce":this.checked
    }
    console.log('obj', obj1);

    this.crudOperationsService.update(obj1, 'leavemasterindividual/113').subscribe((data: any) => {
      this.leaveHeader = data.data;
      console.log('list', data)
    });
  }
  updateCurrent() {
    let obj1 = {
      // "leaveMasterIndividualId":113,
      "employee": { "employeeId": 2 }, "currentBalance": this.list2
    }
    console.log('obj', obj1);
    this.crudOperationsService.update(obj1, 'leavemasterindividual/113').subscribe((data: any) => {
      this.leaveHeader = data.data;
      console.log('list', data)
    });
  }

  getAllEmployees() {
    let url = 'employee/search-list/' + this.companyId + '?search=' + this.searchModel;
    this.crudOperationsService.getList(url)
      .subscribe((data: any) => {

        this.epmloyeeList = data.data.content;

        this.spinner.hide();
      },
        (error) => {
          this.spinner.hide();
          console.log(error);
        })
  }
}
