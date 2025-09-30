import { Component, OnInit } from '@angular/core';
import { ConfigurationService } from '../configuration.service';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';
import { Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-industry-master',
  templateUrl: './industry-master.component.html',
  styleUrls: ['./industry-master.component.css']
})
export class IndustryMasterComponent implements OnInit {

  public industryForm = this.formBuilder.group({
    name: ['', Validators.required]
  })

  get form_() { return this.industryForm.controls; };

  get _form() { return this.industryForm.value };

  public companyId: any = Number(sessionStorage.getItem('companyId'));

  public submitted: boolean = false;
  public requiredErrorText = 'can\'t be blank';
  public submitText = 'Create';
  public api = 'industry-master'
  public submitProcessing = false;
  public popoverTitle = 'Delete Confirmation';
  public popoverMessage = 'Are you sure you want delete';
  public confirmClicked = false;
  public cancelClicked = false;

  public industryList!: any[];
  public id: any = '';

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

  constructor(private notification: NotifierService,
    private crudOperationsService: CrudOperationsService, private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.fetchIndustries();
  }

  public searchModel='';
  fetchIndustries() {
    this.spinner.show();
    let url = this.api + '/list?search='+this.searchModel+'&page=' + this.pageNumber + '&size=' + this.pageSize;
    this.crudOperationsService.getList(url).subscribe((data: any) => {
      this.spinner.hide();
      this.industryList = data.data.content;
      this.industryList.sort((a: any, b: any) => a.id - b.id);
      //pagination call
      this.handlePagination(data);
    },
      (error) => {
        this.spinner.hide();
        this.notification.notify('error', 'Something went wrong!');
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
    this.fetchIndustries();
  }

  submit() {
    this.submitted = true;
    for (let el in this.form_) {
      if (this.form_[el].errors) {
        console.log(el)
      }
    }
    if (this.industryForm.valid) {
      let formData = this.getFormData();
      if (this.submitText !== 'Update') {
        this.save(formData, this.api);
      } else {
        this.update(formData, this.api + `/${this.id}`);
      }
    }
  }
  update(formData: any, api: string) {
    this.submitProcessing = true;
    this.crudOperationsService.update(formData, api)
      .subscribe((data: any) => {
        this.notification.notify('success', data.message);
        (<any>$('#industry-add-modal')).modal('hide');
        this.submitProcessing = false;
        this.ngOnInit();
        this.clear();
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
        this.notification.notify('success', data.message);
        (<any>$('#industry-add-modal')).modal('hide');
        this.submitProcessing = false;
        this.ngOnInit();
        this.clear();
      },
        (_error) => {
          this.submitProcessing = false;
          this.notification.notify('error', 'Something Went Wrong')
        })
  }
  getFormData(): any {
    let companyId = {
      'companyId': this.companyId
    };
    this._form.company = companyId;
    let data = this._form;
    return data;
  }

  modelShowEdit(data: any) {
    this.submitted = false;
    this.submitText = 'Update';
    this.id = data.id;
    this.industryForm.reset();
    this.form_['name'].patchValue(data.name);
    (<any>$('#industry-add-modal')).modal('show');
  }

  delete(id: any) {
    this.crudOperationsService.delete(this.api + '/' + id).subscribe((data: any) => {
      console.log(data)
      this.fetchIndustries();
    })
  }

  clear() {
    this.submitted = false;
    this.industryForm.reset();
  }

}

