import { Component, OnInit } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';
@Component({
  selector: 'app-document-type',
  templateUrl: './document-type.component.html',
  styleUrls: ['./document-type.component.css']
})
export class DocumentTypeComponent implements OnInit {
  public documentTypeList: any;
  public documentTypeName2: any = '';
  public popoverTitle = 'Delete Confirmation';
  public popoverMessage = 'Are you sure you want delete';
  public confirmClicked = false;
  public cancelClicked = false;
  public headers: any = ['Id', 'Document Type Name', 'Action'];
  public documentTypeId: any;
  public documentTypeName: any = '';
  public companyId: any = Number(sessionStorage.getItem('companyId'));
  isDocumentExist: any;
  public searchModel = '';
  public submitted = false;

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

  constructor(private crudOperationsService: CrudOperationsService, private notification: NotifierService,
    private spinner: NgxSpinnerService) { }
  ngOnInit(): void {
    this.fetchAllDocumentType();
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
    this.fetchAllDocumentType();
  }


  fetchAllDocumentType() {
    this.spinner.show();
    let id = sessionStorage.getItem('companyId');
    let api: any = 'documenttype/dropdownList?companyId=' + id + '&search=' + this.searchModel+'&page='+this.pageNumber+'&size=10';
    this.crudOperationsService.getList(api).subscribe((data: any) => {
      this.spinner.hide();
      this.documentTypeList = data.data.content;
      this.handlePagination(data);
    },
      (error) => {
        this.spinner.hide();
        this.notification.notify('error', 'Something Went Worng');
      })
  };
  clear1() {
    this.documentTypeName = '';
    this.submitted = false;
  }
  clear2() {
    this.documentTypeName2 = '';
    this.submitted = false;
  }
  createDocumentType() {
    this.submitted = true;
    if (!this.isDocumentExist && this.documentTypeName) {
      let Object = {
        documentTypeName: this.documentTypeName,
        company: {
          companyId: this.companyId
        }
      }
      let api: any = 'documenttype';
      this.crudOperationsService.create(Object, api).subscribe((data: any) => {
        window.scroll(0, 0);
        (<any>$('#myModal-add')).modal('hide');
        this.notification.notify('success', data.message);
        this.ngOnInit();
        this.clear1();
      }, (error) => {
        this.notification.notify('error', 'something went wrong');
      })
    }
  }
  editDocumentType(doc: any) {
    this.documentTypeId = doc.documentTypeId;
    this.documentTypeName2 = doc.documentTypeName;
  }
  updateDocumentType() {
    this.submitted = true;
    if (!this.isDocumentExist && this.documentTypeName2) {
      let object = { 'documentTypeName': this.documentTypeName2 }
      let api: any = 'documenttype/' + this.documentTypeId;
      this.crudOperationsService.update(object, api).subscribe((data: any) => {
        window.scroll(0, 0);
        (<any>$('#myModal-edit')).modal('hide');
        this.notification.notify('success','Document type Updated Successfully');
        console.log(data);
        this.fetchAllDocumentType();
      })
    }
  }
  removeDocumentType(id: any) {
    this.documentTypeId = id.documentTypeId;
  }
  deleteDocumentType(id: number) {
    let api: any = 'documenttype/' + id;
    this.crudOperationsService.delete(api).subscribe((data: any) => {
      console.log(data);
      this.fetchAllDocumentType();
    },(error:any) => {
      this.spinner.hide();
      let erroe:any=error.error.message;
      this.notification.notify("error",erroe);
    })
  }
  check() {
    this.isDocumentExist = false;
    let api = 'documenttype/validate?name=' + this.documentTypeName;
    this.crudOperationsService.validate(api)
      .subscribe((data: any) => {
        this.isDocumentExist = data;
      },
        (_error: any) => {
          this.notification.notify('error', 'Something Went Worng');
        })
  }
}