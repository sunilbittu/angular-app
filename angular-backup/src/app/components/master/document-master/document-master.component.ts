import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';
import { Sort } from '@angular/material/sort';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-document-master',
  templateUrl: './document-master.component.html',
  styleUrls: ['./document-master.component.css']
})
export class DocumentMasterComponent implements OnInit {






  public headers: any = ['Document Code', 'Document Name', 'Mandatory', 'Document Type', 'Action'];
  public documentObject: any = [];
  public documentNameModel: any;
  public mandatoryModel: any = '';
  public documentTypeModel: any = '';
  public documentId: any = '';
  public documentName: any;
  public mandatory: any;
  public documentTypeName: any;
  public documentNameModel1: any;
  public mandatoryModel1: any = '';
  public documentTypeModel1: any = '';
  public documentType: any = [];
  public companyId: any = Number(sessionStorage.getItem('companyId'));
  public isDocumentExist: any;
  public searchModel = '';
  public documentMastersForm: any;
  public documentNameFilled: boolean = false;
  public MandatoryFilled: boolean = false;
  public documentTypeFilled: boolean = false;
  public submitted: boolean = false;
  public documentNameFilled2: boolean = false;
  public MandatoryFilled2: boolean = false;
  public documentTypeFilled2: boolean = false;
  public submitted2: boolean = false;
  public requiredErrorText = 'can\'t be blank';
  public sortedData: any = [];
  //public documentarray:any=[];

  public popoverTitle = 'Delete Confirmation';
  public popoverMessage = 'Are you sure you want delete';
  public cancelClicked: boolean = false;

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

  constructor(public crudOperationsService: CrudOperationsService, private notification: NotifierService, private formBuilder: FormBuilder, private spinner: NgxSpinnerService) {
    // this.sortedData = this.documentarray.slice();

  }

  ngOnInit(): void {
    this.fetchAllDocumentMasters();
    this.fetchDocumentType();
  }

  sortData(sort: Sort) {
    this.sortedData = this.crudOperationsService.sortData(sort, this.documentObject);

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
    this.fetchAllDocumentMasters();
  }
  createDocumentMaster() {

    this.submitted = true;
    console.log(this.documentNameFilled, this.MandatoryFilled, this.documentTypeFilled)
    if (this.documentNameFilled == true && this.MandatoryFilled == true && this.documentTypeFilled == true) {
      if (!this.isDocumentExist) {
        let object = { 'documentName': this.documentNameModel, 'mandatory': this.mandatoryModel, 'documentType': { 'documentTypeId': this.documentTypeModel }, 'company': { 'companyId': this.companyId } }
        this.crudOperationsService.create(object, 'documentmaster').subscribe((data: any) => {
          window.scroll(0, 0);
          (<any>$('#myModal-add')).modal('hide');
          console.log(data);
          this.fetchAllDocumentMasters();
          this.documentNameModel = '';
          this.mandatoryModel = '';
          this.documentTypeModel = '';
          this.submitted = false;
          this.documentNameFilled = false;
          this.MandatoryFilled = false;
          this.documentTypeFilled = false;
        })
      }
    }
  }

  fetchAllDocumentMasters() {
    this.spinner.show();
    let api: any = 'documentmaster/list?companyId=' + this.companyId + '&search=' + this.searchModel + "&page=" + this.pageNumber + "&size=10";
    this.crudOperationsService.getList(api).subscribe((data: any) => {
      this.spinner.hide();
      this.documentObject = data.data.content;
      // this.documentarray=data.data.content;
      this.sortedData = data.data.content;
      this.handlePagination(data);

      //this.documentObject.sort((a: any, b: any) => a.documentId - b.documentId);
    },
      (error) => {
        this.spinner.hide();
        this.notification.notify('error', 'Something Went Worng');
      })
  }

  editDocumentMaster(doc: any) {
    this.documentId = doc.documentId;
    this.documentNameModel1 = doc.documentName;
    this.mandatoryModel1 = doc.mandatory;
    this.documentTypeModel1 = doc.documentTypeId;
    this.documentNameFilled2 = true;
    this.MandatoryFilled2 = true;
    this.documentTypeFilled2 = true;

  }


  updateDocumentMaster() {
    this.submitted2 = true;
    if (!this.isDocumentExist) {
      let object = { 'documentName': this.documentNameModel1, 'mandatory': this.mandatoryModel1, 'documentType': { 'documentTypeId': this.documentTypeModel1 } }
      let api: any = 'documentmaster/' + this.documentId;
      this.crudOperationsService.update(object, api).subscribe((data: any) => {
        window.scroll(0, 0);
        (<any>$('#myModal-edit')).modal('hide');
        console.log(data);
        this.fetchAllDocumentMasters();
      })
    }
  }

  removeDocumentMaster(doc: any) {
    this.documentId = doc.documentId;
  }

  deleteDocumentMaster(id: any) {
    let api: any = 'documentmaster/' + id;
    this.crudOperationsService.delete(api).subscribe((data: any) => {
      if (data.status == 'success') {
        this.notification.notify('success', data.message);
      }
      this.fetchAllDocumentMasters();
    },
      (error) => {
        if (error.error.error == 'Conflict') {
          this.notification.notify('error', error.error.message);
        } else {
          this.notification.notify('error', 'Something Went Worng');
        }
      })
  }

  fetchDocumentType() {
    let api: any = 'documenttype/dropdownList?companyId=' + this.companyId + '&search='+'&page=&size=';
    this.crudOperationsService.getList(api).subscribe((data: any) => {
      this.documentType = data.data.content;
    })
  }

  clear() {
    this.documentNameModel = '';
    this.mandatoryModel = '';
    this.documentTypeModel = '';
    this.documentNameModel1 = '';
    this.mandatoryModel1 = '';
    this.documentTypeModel1 = '';
    this.documentTypeFilled = false;
    this.documentNameFilled = false;
    this.MandatoryFilled = false;
    this.submitted = false;
    this.documentTypeFilled2 = false;
    this.documentNameFilled2 = false;
    this.MandatoryFilled2 = false;
    this.submitted2 = false;

  }

  mandatorySelected() {
    this.MandatoryFilled = true;
  }
  mandatorySelected2() {
    //this.MandatoryFilled=true;
  }

  documentTypeSelected() {
    this.documentTypeFilled = true;
  }
  documentTypeSelected2() {
    this.documentTypeFilled = true;
  }

  check() {
    if (this.documentNameModel != " " && this.documentNameModel != null) {
      this.documentNameFilled = true;
    }
    this.isDocumentExist = false;
    let api = 'documentmaster/validate?name=' + this.documentNameModel;
    this.crudOperationsService.validate(api)
      .subscribe((data: any) => {
        this.isDocumentExist = data;
      },
        (_error: any) => {
          this.notification.notify('error', 'Something Went Worng');
        })
  }

  mandatorySelected1() {
    this.MandatoryFilled2 = true;
  }

  documentTypeSelected1() {
    this.documentTypeFilled2 = true;
  }
  check1() {
    if (this.documentNameModel1 != "" && this.documentNameModel1 != null) {
      this.documentNameFilled2 = true;
    }
    this.isDocumentExist = false;
    let api = 'documentmaster/validate?name=' + this.documentNameModel1;
    this.crudOperationsService.validate(api)
      .subscribe((data: any) => {
        this.isDocumentExist = data;
      },
        (_error: any) => {
          this.notification.notify('error', 'Something Went Worng');
        })
  }

}
