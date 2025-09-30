import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeMastersService } from '../employee.masters.service';
import { NotifierService } from 'angular-notifier';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import { Sort } from '@angular/material/sort';
declare var $: any;
@Component({
  selector: 'app-branch-master',
  templateUrl: './branch-master.component.html',
  styleUrls: ['./branch-master.component.css']
})
export class BranchMasterComponent implements OnInit {
  public branchMasterForm!: FormGroup;
  public branchMasterObject!: any;
  public branchDetailsList!: any[];
  public submitted: boolean = false;
  public branchDetailsId!: any;
  public editButtonEnable!: boolean;
  public exist: boolean = false;
  public exist2: boolean = false;
  public requiredErrorText = 'can\'t be blank';
  public companyId!: number;
  public headers: any = ["Branch Code", "Branch Name", "Address", "PT Apply", "PT Reg. No.", "PT Office", "PT Slab", "Action"];
  public popoverTitle = 'Delete Confirmation';
  public popoverMessage = 'Are you sure you want delete';
  public confirmClicked = false;
  public cancelClicked = false;
  public sortedData: any = [];
  public currencyTypeList: any = [];

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


  constructor(private formBuilder: FormBuilder, private employeMasterService: EmployeeMastersService,
    private notification: NotifierService, private crudOperationsService: CrudOperationsService, private spinner: NgxSpinnerService) { }
  ngOnInit(): void {
    this.branchMasterForm = this.formBuilder.group({
      branchCode: ['', Validators.required],
      branchName: ['', Validators.required],
      branchAddress: [],
      currencyId: ['', Validators.required],
      profTaxAppication: [false],
      profTaxSlab: [],
      profTaxRegNo: [],
      PtLocalOffice: []
    })
    //fetch branchDetailsList
    this.fetchBranchDetailsList();
    // fetch Currency
    this.fetchCurrencyTypeList();
  }
  get form_() { return this.branchMasterForm.controls; };

  sortData(sort: Sort) {
    this.sortedData = this.crudOperationsService.sortData(sort, this.branchDetailsList);

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
    this.fetchBranchDetailsList();
  }

  //clear form values
  modelShow() {
    this.branchMasterForm.reset();
    //hide edit button
    this.editButtonEnable = false;
  }
  checkIfalreadyExist2(typedCode: any) {
    if (this.editButtonEnable == true) {
      let branchDetailsList2: any[] = this.branchDetailsList.filter(y => y.companyBranchDetailsId != this.branchDetailsId);
      let code: any[] = branchDetailsList2.filter(
        x => x.branchCode.toLowerCase() == typedCode.target.value.toLowerCase());
      if (code.length > 0) {
        this.exist2 = true;
      } else {
        this.exist2 = false;
      }
    } else {
      let code: any[] = this.branchDetailsList.filter(
        x => x.branchCode.toLowerCase() == typedCode.target.value.toLowerCase());
      if (code.length > 0) {
        this.exist2 = true;
      } else {
        this.exist2 = false;
      }
    }
  }
  checkIfalreadyExist(typedName: any) {
    if (this.editButtonEnable == true) {
      let branchDetailsList2: any[] = this.branchDetailsList.filter(y => y.companyBranchDetailsId != this.branchDetailsId);
      let name: any[] = branchDetailsList2.filter(
        x => x.branchName.toLowerCase() == typedName.target.value.toLowerCase());
      if (name.length > 0) {
        this.exist = true;
      } else {
        this.exist = false;
      }
    } else {
      let name: any[] = this.branchDetailsList.filter(
        x => x.branchName.toLowerCase() == typedName.target.value.toLowerCase());
      if (name.length > 0) {
        this.exist = true;
      } else {
        this.exist = false;
      }
    }
  }
  fetchCurrencyTypeList() {
    this.companyId = Number(sessionStorage.getItem('companyId'));
    //let api: any = 'currency/list_company/' + this.companyId;
    let api: any = "currency/list_company/" + this.companyId + "?search=";

    this.crudOperationsService.getList(api)
      .subscribe((data: any) => {
        this.currencyTypeList = data.data.content;
      },
        (error) => {
          this.notification.notify('error', 'Something Went Worng');
        })
  }
  public searchModel = "";
  fetchBranchDetailsList() {
    //getting companyId from session-storage
    this.spinner.show();
    this.companyId = Number(sessionStorage.getItem('companyId'));
    return this.employeMasterService.getBranchMaster(this.companyId,this.pageNumber)
      .subscribe((data: any) => {
        this.spinner.hide();
        this.branchDetailsList = data.data.content;
        this.sortedData = data.data.content;
        this.handlePagination(data);
        console.log("Inside fetchBranchDetailsList");
        //console.log(this.branchDetailsList, "branch details");
      },
        (error) => {
          this.spinner.hide();
          this.notification.notify('error', 'Something Went Worng');
        })
  }
  //delete function
  deleteBranchDetails(id: number) {
    console.log(this.confirmClicked);
    this.employeMasterService.deleteBranchDetails(id)
      .subscribe((data: any) => {
        if (data.status == 'success') {
          this.notification.notify('success', data.message);
        }
        //fetch btranchDetailsList
        this.fetchBranchDetailsList();
      },
        (error) => {
          if (error.error.error == 'Conflict') {
            this.notification.notify('error', error.error.message);
          } else {
            this.notification.notify('error', 'Something Went Worng');
          }
        })
  }
  //edit function
  getBranchDetailsById(id: number) {
    this.branchDetailsId = id;
    //show edit button
    this.editButtonEnable = true;
    let url = 'branchdetail/getCurrencyCode/' + id;
    this.crudOperationsService.getList(url)
      .subscribe((data: any) => {
        const branchDetailsByIdObject = data.data;
        let currencyId = '';
        if (branchDetailsByIdObject.currencyMaster) {
          currencyId = branchDetailsByIdObject.currencyMaster.currencyId;
        } else {
          currencyId = '';
        }
        this.branchMasterForm.patchValue({
          branchCode: branchDetailsByIdObject.branchCode,
          branchName: branchDetailsByIdObject.branchName,
          branchAddress: branchDetailsByIdObject.address,
          profTaxAppication: branchDetailsByIdObject.profTaxApplication,
          profTaxSlab: branchDetailsByIdObject.companyBranchType,
          profTaxRegNo: branchDetailsByIdObject.profTaxRegNo,
          PtLocalOffice: branchDetailsByIdObject.profTaxLocalOffice,
          currencyId: currencyId
        })
      })
  }
  //update BranchMasterDetails
  updateBranchMasterDetails() {
    this.submitted = true;
    //alert(this.branchDetailsId)
    if (this.branchMasterForm.valid == true && this.exist == false && this.exist2 == false) {
      this.branchMasterObject =
      {
        "companyBranchDetailsId": this.branchDetailsId,
        "address": this.branchMasterForm.value.branchAddress,
        "branchCode": this.branchMasterForm.value.branchCode,
        "branchName": this.branchMasterForm.value.branchName,
        "isDeleted": false,
        "companyBranchType": this.branchMasterForm.value.profTaxSlab,
        "profTaxApplication": this.branchMasterForm.value.profTaxAppication,
        "profTaxLocalOffice": this.branchMasterForm.value.PtLocalOffice,
        "profTaxRegNo": this.branchMasterForm.value.profTaxRegNo,
        "createdBy": "Naresh",
        "createdDate": new Date(),
        "cityId": 1,
        "company":
        {
          "companyId": this.companyId
        },
        "currencyMaster":
        {
          "currencyId": this.branchMasterForm.value.currencyId
        }
      }
      this.employeMasterService.updateBranchDetails(this.branchDetailsId, this.branchMasterObject)
        .subscribe((data: any) => {
          this.notification.notify('success', data.message);
          $('#employeeModelPopup').modal('hide');
          this.submitted = false;
          //fetch btranchDetailsList
          this.fetchBranchDetailsList();
        },
          (error) => {
            this.notification.notify('error', 'Something Went Worng');
          })
    }
  }
  onSubmit() {
    this.submitted = true;
    if (this.branchMasterForm.valid == true && this.exist == false && this.exist2 == false) {
      this.branchMasterObject =
      {
        "address": this.branchMasterForm.value.branchAddress,
        "branchCode": this.branchMasterForm.value.branchCode,
        "branchName": this.branchMasterForm.value.branchName,
        "isDeleted": false,
        "companyBranchType": this.branchMasterForm.value.profTaxSlab,
        "profTaxApplication": this.branchMasterForm.value.profTaxAppication,
        "profTaxLocalOffice": this.branchMasterForm.value.PtLocalOffice,
        "profTaxRegNo": this.branchMasterForm.value.profTaxRegNo,
        "createdBy": "Naresh",
        "createdDate": new Date(),
        "cityId": 1,
        "company":
        {
          "companyId": this.companyId
        },
        "currencyMaster":
        {
          "currencyId": this.branchMasterForm.value.currencyId
        }
      }
      this.employeMasterService.addBranchMasters(this.branchMasterObject)
        .subscribe((data: any) => {
          this.submitted = false;
          this.notification.notify('success', data.message);
          $('#employeeModelPopup').modal('hide');
          //fetch btranchDetailsList
          this.ngOnInit();
        }
          ,
          (error) => {
            error instanceof HttpErrorResponse
            console.log(error)
            if (error.error.status == 406) {
              this.notification.notify('error', 'BranchName/BranchCode Already Exits');
            }
            else {
              this.notification.notify('error', 'Something Went Wrong');
            }
          })
    }
  }
  getBranchListBySearchParam($event: any) {
    const param = $event.target.value;
    //console.log(param);
    if (param.trim() == "") {
      //geting agents list
      this.fetchBranchDetailsList();
    }
    else {
      //alert($event.target.value);
      //this.spinner.show();
      let api: any = "branchdetail/list_company/1?searchParam=" + param + "&page=" + this.pageNumber + "&size=10";
      this.crudOperationsService.getList(api)
        .subscribe((data: any) => {
          this.branchDetailsList = data.data.content;
          this.sortedData = data.data.content;
          console.log('Inside getBranchListBySearchParam');
          this.handlePagination(data);
          //spinner hide
          this.spinner.hide();
        },
          (error) => {
            console.log(error);
            //spinner hide
            //this.spinner.hide();
            this.notification.notify('error', 'Something Went Wrong');
          })
    }
  }
  // getCurrencyType() {
  //   let url = 'branchdetail/getCurrencyCode/'+this.addEmployeeForm.value.Branch;
  //   this.crudOperationsService.getList(url)
  //     .subscribe((data: any) => {
  //       this.branchDetails = data.data;
  //       if(this.branchDetails.currencyMaster) {
  //         this.currencyType = '(' + this.branchDetails.currencyMaster.currencyCode.toUpperCase() + ')';
  //       } else {
  //         this.currencyType = '';
  //       }
  //     },
  //       (error) => {
  //         this.notification.notify('error', 'Something Went Worng');
  //       })
  // }
}
