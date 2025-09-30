import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { EmployeeMastersService } from '../employee.masters.service';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Sort } from '@angular/material/sort';

declare var $: any;


@Component({
  selector: 'app-department-master',
  templateUrl: './department-master.component.html',
  styleUrls: ['./department-master.component.css']
})
export class DepartmentMasterComponent implements OnInit {

  public departmentMastersForm!: FormGroup;
  public editButtonEnable!: boolean;
  public branchDetailsList!: any[];
  public departmentMasterList!: any[];
  public departmentObject!: any;
  public departmentMasterId!: any;
  public companyId!: number;
  public popoverTitle = 'Delete Confirmation';
  public popoverMessage = 'Are you sure you want delete';
  public confirmClicked = false;
  public cancelClicked = false;
  public sortedData: any = [];

  //pagination
  public p: number = 1;
  itemsPerPage: any=10;
  totalItems: any;
  currentPage: any;
  totalElements: number = 0;
  showingFrom: number = 0;
  showingTo: number = 0;
  public pageNumber: Number = 0;
  public pageSize: number = 10;

  public headers: any = ["Department Code", "Department Name", "Branch", "Action"];
  public requiredErrorText = 'can\'t be blank';

  public employees: any = [
    { departmentCode: '123', departmentName: 'Science' },
    { departmentCode: '123', departmentName: 'Science' }
  ]
  public submitted!: boolean;
  public exist: boolean = false;

  constructor(private formBuilder: FormBuilder, private employeMasterService: EmployeeMastersService,
    private notification: NotifierService, private crudOperationsService: CrudOperationsService, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {

    this.departmentMastersForm = this.formBuilder.group({

      departmentCode: ['', Validators.required],
      departmentName: ['', Validators.required],
      bepartmentBranch: ['', Validators.required]

    })

    //fetch branchDetails
    this.fetchBranchDetailsList();

    //get department List
    this.fetchDepartmentList();
  }

  get form_() { return this.departmentMastersForm.controls; };

  sortData(sort: Sort) {
    this.sortedData = this.crudOperationsService.sortData(sort, this.departmentMasterList);

  }

  fetchBranchDetailsList() {
    //getting companyId from session-storage
    this.companyId = Number(sessionStorage.getItem('companyId'));
    return this.employeMasterService.getBranchMaster(this.companyId)
      .subscribe((data: any) => {
        this.branchDetailsList = data.data.content;

      },
        (error) => {
          this.notification.notify('error', 'Something Went Worng');
        })

  }
  public handlePagination(data: any) {
    this.totalElements = data.data.totalElements;
    this.itemsPerPage = 10;
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

  public pageChanged(event: any): void {
    this.pageNumber = event - 1;
    this.fetchDepartmentList();
  }

  //get deepartmentList
  fetchDepartmentList() {
    this.spinner.show();
    this.companyId = Number(sessionStorage.getItem('companyId'));
    this.employeMasterService.getDepartmentList(this.companyId,this.pageNumber)
      .subscribe((data: any) => {
        this.spinner.hide();
        this.departmentMasterList = data.data.content;
        this.sortedData = data.data.content;
        this.handlePagination(data);

      }
        ,
        (error) => {
          this.spinner.hide();
          this.notification.notify('error', 'Something Went Worng');
        })

  }

  public searchModel='';
  getDepartmentListBySearchParam($event: any) {
    const param = $event.target.value;
    this.searchModel=param;
    if (param.trim() == "") {
      //geting agents list
      this.fetchDepartmentList();
    }

    else {
      //alert($event.target.value);



      let api: any = "department/list_company/1?search=" + param+"&page=" + this.pageNumber + "&size=10";

      this.crudOperationsService.getList(api)
        .subscribe((data: any) => {
          //this.departmentMasterList = data.data.content
          this.departmentMasterList = data.data.content;
          this.sortedData = data.data.content;
          this.handlePagination(data);


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

  //clear form values
  modelShow() {

    this.departmentMastersForm.reset();
    //hide edit button
    this.editButtonEnable = false;

  }



  //edit form controlls
  editDepartment(id: number) {

    this.editButtonEnable = true

    this.departmentMasterId = id;

    this.employeMasterService.getDepartmentMasterById(id)
      .subscribe((data: any) => {
        const departmentMasterById = data.data[0];
        this.departmentMastersForm.patchValue({

          departmentCode: departmentMasterById.departmentCode,
          departmentName: departmentMasterById.departmentName,
          bepartmentBranch: departmentMasterById.branchId
        })
      },
        (error) => {
          this.notification.notify('error', 'Something Went Worng');
        })


  }

  //update function
  updateDepartmentMaster(id: number) {

    this.submitted = true;
    if (this.departmentMastersForm.valid == true && this.exist == false) {

      this.departmentObject =

      {

        "departmentId": this.departmentMasterId,
        "departmentCode": this.departmentMastersForm.value.departmentCode,
        "departmentName": this.departmentMastersForm.value.departmentName,
        "branchDetail": {
          "companyBranchDetailsId": this.departmentMastersForm.value.bepartmentBranch
        },

        "company": {
          "companyId": this.companyId
        }

      }
    }


    this.employeMasterService.updateDepartmentMaster(this.departmentMasterId, this.departmentObject)
      .subscribe((data: any) => {
        this.notification.notify('success', data.message);
        $('#employeeModelPopup').modal('hide');
        this.submitted = false;

        //get deepartmentList
        this.fetchDepartmentList()

      },

        (error) => {
          this.notification.notify('error', 'Something Went Worng');
        })


  }

  changed() {
    this.exist = false;
    if (this.editButtonEnable == true) {
      this.alreadyExists2();
    } else {
      this.alreadyExists();
    }
  }

  //delete departmentMaster
  deleteDepartmentMasterById(id: number) {
    this.employeMasterService.deleteDepartmentListById(id)
      .subscribe((data: any) => {
        if (data.status == 'success') {
          this.notification.notify('success', data.message);
        }
        this.fetchDepartmentList();
      },
        (error) => {
          if (error.error.error == 'Conflict') {
            this.notification.notify('error', error.error.message);
          } else {
            this.notification.notify('error', 'Something Went Worng');
          }
        })
  }

  alreadyExists() {

    let name: any[] = this.departmentMasterList.filter(x => x.departmentName == this.departmentMastersForm.value.departmentName && x.branchId == this.departmentMastersForm.value.bepartmentBranch);
    if (name.length > 0) {
      this.exist = true;
    } else {
      this.exist = false;
    }

  }

  alreadyExists2() {
    let departmentMasterList2: any[] = this.departmentMasterList.filter(y => y.departmentId != this.departmentMasterId);

    let name: any[] = departmentMasterList2.filter(x => x.departmentName == this.departmentMastersForm.value.departmentName && x.branchId == this.departmentMastersForm.value.bepartmentBranch);
    if (name.length > 0) {
      this.exist = true;
    } else {
      this.exist = false;
    }

  }


  onSubmit() {


    this.submitted = true;
    this.alreadyExists();
    if (this.departmentMastersForm.valid == true && this.exist == false) {
      this.departmentObject =
      {
        "departmentCode": this.departmentMastersForm.value.departmentCode,
        "departmentName": this.departmentMastersForm.value.departmentName,
        "branchDetail": {
          "companyBranchDetailsId": this.departmentMastersForm.value.bepartmentBranch
        },

        "company": {
          "companyId": this.companyId
        }


      }



      this.employeMasterService.postDepartmentMaster(this.departmentObject)
        .subscribe((data: any) => {
          this.notification.notify('success', data.message);
          $('#employeeModelPopup').modal('hide');
          this.submitted = false;

          //get department List
          this.fetchDepartmentList();
        },

          (error) => {

            error instanceof HttpErrorResponse

            console.log(error)

            if (error.error.status == 406) {

              this.notification.notify('error', 'DepartmentName/DepartmentCode Already Exits');
            }

            else {

              this.notification.notify('error', 'Something Went Wrong');

            }




          })

    }
  }

}
