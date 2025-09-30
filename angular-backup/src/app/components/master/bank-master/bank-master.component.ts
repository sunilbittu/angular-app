import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Sort } from '@angular/material/sort';

declare var $: any;
@Component({
  selector: 'app-bank-master',
  templateUrl: './bank-master.component.html',
  styleUrls: ['./bank-master.component.css']
})
export class BankMasterComponent implements OnInit {
  public bankMastersForm!: FormGroup;
  public editButtonEnable!: boolean;
  public bankMasterList!: any[];
  public bankObject!: any;
  public bankMasterId!: any;
  public companyId!: number;
  public bannkMasterGetById: any;
  public searchModel = '';
  public popoverTitle = 'Delete Confirmation';
  public popoverMessage = 'Are you sure you want delete';
  public confirmClicked = false;
  public cancelClicked = false;
  public exist: boolean = false;
  public exist2: boolean = false;
  public requiredErrorText = 'can\'t be blank';
  public submitted: boolean = false;
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

  public headers: any = ["Bank Name", "Bank Code", "Bank Address", "IFSC Code", "Action"];
  constructor(private formBuilder: FormBuilder, private crudOperationsService: CrudOperationsService,
    private notification: NotifierService, private spinner: NgxSpinnerService) { }
  ngOnInit(): void {
    this.bankMastersForm = this.formBuilder.group({
      bankName: ['', Validators.required],
      bankCode: ['', Validators.required],
      bankAddress: [''],
      ifscCode: ['', Validators.required],
    })
    this.fetchBankMasterList()
  }
  get form_() { return this.bankMastersForm.controls; };

  sortData(sort: Sort) {
    this.sortedData = this.crudOperationsService.sortData(sort, this.bankMasterList);

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
    this.fetchBankMasterList();
  }

  //clear form values
  modelShow() {
    this.exist = false;
    this.exist2 = false;
    this.bankMastersForm.reset();
    //hide edit button
    this.editButtonEnable = false;
  }

  checkIfalreadyExist2(typedCode: any) {

    if (this.editButtonEnable == true) {
      let bankMasterList2: any[] = this.bankMasterList.filter(y => y.bankId != this.bankMasterId);

      let code: any[] = bankMasterList2.filter(
        x => x.bankCode.toLowerCase() == typedCode.toLowerCase());

      if (code.length > 0) {
        this.exist2 = true;
      } else {
        this.exist2 = false;
      }
    } else {
      let code: any[] = this.bankMasterList.filter(
        x => x.bankCode.toLowerCase() == typedCode.toLowerCase());

      if (code.length > 0) {
        this.exist2 = true;
      } else {
        this.exist2 = false;
      }
    }
  }
  checkIfalreadyExist(typedName: any) {

    if (this.editButtonEnable == true) {
      let bankMasterList2: any[] = this.bankMasterList.filter(y => y.bankId != this.bankMasterId);

      let name: any[] = bankMasterList2.filter(
        x => x.bankName.toLowerCase() == typedName.toLowerCase());

      if (name.length > 0) {
        this.exist = true;
      } else {
        this.exist = false;
      }
    } else {
      let name: any[] = this.bankMasterList.filter(
        x => x.bankName.toLowerCase() == typedName.toLowerCase());

      if (name.length > 0) {
        this.exist = true;
      } else {
        this.exist = false;
      }
    }
  }
  //get deepartmentList
  fetchBankMasterList() {
    this.spinner.show();
    this.companyId = Number(sessionStorage.getItem('companyId'));
    let api: any = 'bankmaster/list_company/' + this.companyId + '?search=' + this.searchModel + "&page=" + this.pageNumber + "&size=10";
    this.crudOperationsService.getList(api)
      .subscribe((data: any) => {
        this.spinner.hide();
        this.bankMasterList = data.data.content;
        this.sortedData = data.data.content;
        this.handlePagination(data);

        console.log(this.bankMasterList);
      }
        ,
        (error) => {
          this.spinner.hide();
          this.notification.notify('error', 'Something Went Worng');
        })
  }
  //edit form controlls
  editBankMaster(id: number) {
    this.editButtonEnable = true;
    this.bankMasterId = id;
    let api: any = "bankmaster/" + id
    this.crudOperationsService.getList(api)
      .subscribe((data: any) => {
        this.bannkMasterGetById = data.data
        this.bankMastersForm.patchValue({
          bankName: this.bannkMasterGetById.bankName,
          bankCode: this.bannkMasterGetById.bankCode,
          bankAddress: this.bannkMasterGetById.bankAddress,
          ifscCode: this.bannkMasterGetById.ifsc
        })
      },
        (error) => {
          this.notification.notify('error', 'Somethinng Went Wrong');
        })
  }
  //update function
  updateBankMaster() {
    this.submitted = true;

    if (this.bankMastersForm.valid == true && this.exist == false && this.exist2 == false) {

      this.bankObject =
      {
        "bankId": this.bannkMasterGetById.bankId,
        "bankName": this.bankMastersForm.value.bankName,
        "bankCode": this.bankMastersForm.value.bankCode,
        "bankAddress": this.bankMastersForm.value.bankAddress,
        "ifsc": this.bankMastersForm.value.ifscCode,
        "company": {
          "companyId": this.companyId
        }
      }
      let api: any = "bankmaster/" + this.bannkMasterGetById.bankId
      this.crudOperationsService.update(this.bankObject, api)
        .subscribe((data: any) => {
          this.submitted = false;

          this.notification.notify('success', data.message);
          $('#employeeModelPopup').modal('hide');
          this.bankMastersForm.reset();
          //get updated List
          this.fetchBankMasterList();
        },
          (error) => {
            this.notification.notify('error', 'Somethinng Went Wrong');
          })
    }
  }
  deleteBankMasterById(id: number) {
    let api: any = "bankmaster/" + id;
    this.crudOperationsService.delete(api)
      .subscribe((data: any) => {
        if (data.status == 'success') {
          this.notification.notify('success', data.message);
        }
        this.fetchBankMasterList();
      },
        (error) => {
          if (error.error.error == 'Conflict') {
            this.notification.notify('error', error.error.message);
          } else {
            this.notification.notify('error', 'Something Went Worng');
          }
        })
  }
  onSubmit() {
    this.submitted = true;

    if (this.bankMastersForm.valid == true && this.exist == false && this.exist2 == false) {

      this.bankObject =
      {
        "bankName": this.bankMastersForm.value.bankName,
        "bankCode": this.bankMastersForm.value.bankCode,
        "bankAddress": this.bankMastersForm.value.bankAddress,
        "ifsc": this.bankMastersForm.value.ifscCode,
        "company": {
          "companyId": this.companyId
        }
      }
      let api: any = 'bankmaster'
      this.crudOperationsService.create(this.bankObject, api)
        .subscribe((data: any) => {
          this.submitted = false;

          this.notification.notify('success', data.message);
          $('#employeeModelPopup').modal('hide');
          //get updated List
          this.fetchBankMasterList();
        },
          (error) => {
            this.notification.notify('error', 'Something Went Wrong')
          })
    }
  }
}
