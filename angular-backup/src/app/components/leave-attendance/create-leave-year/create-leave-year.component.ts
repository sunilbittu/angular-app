import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';

@Component({
  selector: 'app-create-leave-year',
  templateUrl: './create-leave-year.component.html',
  styleUrls: ['./create-leave-year.component.css']
})
export class CreateLeaveYearComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private spinner: NgxSpinnerService,
    public crudOperationsService: CrudOperationsService, private notification: NotifierService) { }

  public headers: any = ["Year", "Action"];
  public companyId: any = Number(sessionStorage.getItem('companyId'));
  public yearForm = this.formBuilder.group({
    year: ['', Validators.required],
  })

  get form_() { return this.yearForm.controls; };
  get _form() { return this.yearForm.value };

  public id: any = '';
  public submitted: boolean = false;
  public requiredErrorText = 'can\'t be blank';
  public submitText = 'Save';
  public api = 'leaveyear'
  public submitProcessing = false;
  public leaveYearList: any = [];
  public isYearExist: any;
  public tempYear = '';

  public popoverTitle = 'Delete Confirmation';
  public popoverMessage = 'Are you sure, you want to delete';
  public confirmClicked = false;
  public cancelClicked = false;

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

  ngOnInit(): void {
    this.getLeaveYearList();
  }

  getLeaveYearList() {
    this.spinner.show();
    let api = this.api + '/list/' + this.companyId + '?page=' + this.pageNumber + '&size=' + this.pageSize;
    this.crudOperationsService.getList(api).subscribe((data: any) => {
      this.spinner.hide();
      this.leaveYearList = data.data.content;
      //pagination call
      this.handlePagination(data);
    },
      (error) => {
        this.spinner.hide();
        console.log(error);
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
    this.getLeaveYearList();
  }

  addClick() {
    this.yearForm.reset();
    this.submitText = 'Save';
    this.submitted = false;
    this.isYearExist = false;
  }

  modelShowEdit(data: any) {
    this.submitted = false;
    this.submitText = 'Update';
    this.id = data.leaveYearId;
    this.yearForm.reset();
    this.form_['year'].patchValue(data.leaveYear);
    this.tempYear = data.leaveYear;
    (<any>$('#create')).modal('show');
  }

  delete(id: number) {
    this.spinner.show();
    this.crudOperationsService.delete(this.api + `/${id}`).subscribe((data: any) => {
      this.notification.notify('success', data.message);
      this.ngOnInit();
    },
      (error: any) => {
        this.spinner.hide();
        let erroe: any = error.error.message;
        this.notification.notify("error", erroe);
      })
  }

  submit() {
    this.submitted = true;
    this.isYearExist = false;
    for (let el in this.form_) {
      if (this.form_[el].errors) {
        console.log(el)
      }
    }
    if (!this.isYearExist && this.yearForm.valid) {
      if (this.tempYear === this._form.year) {
        this.performSaveOrUpdateOperation();
      } else {
        let api = this.api + '/validate?leaveYear=' + this._form.year + '&companyId=' + this.companyId;
        this.crudOperationsService.validate(api)
          .subscribe((data: any) => {
            this.isYearExist = data;
            console.log('er : ', this.isYearExist)
            if (!this.isYearExist) {
              this.performSaveOrUpdateOperation();
            }
          });
      }
    }
  }
  performSaveOrUpdateOperation() {
    let obj = {
      "company": { 'companyId': this.companyId },
      "leaveYear": this._form.year
    }
    if (this.submitText !== 'Update') {
      this.save(obj, this.api);
    } else {
      this.update(obj, this.api + `/${this.id}`);
    }
  }
  update(formData: any, api: string) {
    this.submitProcessing = true;
    this.crudOperationsService.update(formData, api)
      .subscribe((data: any) => {
        this.notification.notify(data.status, data.message);
        this.submitProcessing = false;
        if (data.status == 'success') {
          (<any>$('#create')).modal('hide');
          this.ngOnInit();
          this.clear();
        }
      },
        (_error) => {
          this.submitProcessing = false;
          this.notification.notify('error', 'Something Went Wrong')
        })
  }
  save(formData: any, api: string) {
    this.submitProcessing = true;
    this.crudOperationsService.create(formData, api)
      .subscribe((data: any) => {
        this.notification.notify(data.status, data.message);
        this.submitProcessing = false;
        if (data.status == 'success') {
          (<any>$('#create')).modal('hide');
          this.ngOnInit();
          this.clear();
        }
      },
        (_error) => {
          this.submitProcessing = false;
          this.notification.notify('error', 'Something Went Wrong')
        })
  }

  clear() {
    this.yearForm.reset();
    this.submitted = false;
    this.id = undefined;
    this.submitText = 'Save';
    this.isYearExist = false;
  }

  public check(): any {
    this.isYearExist = false;
  }

  checkNumberFieldLength(elem: any) {
    if(elem.value.length > 4) {
      elem.value = elem.value.slice(0,4);
    }
  }
}
