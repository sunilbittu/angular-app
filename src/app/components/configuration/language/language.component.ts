import { Component, OnInit } from '@angular/core';
import { ConfigurationService } from '../configuration.service';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';
import { Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-language',
  templateUrl: './language.component.html',
  styleUrls: ['./language.component.css']
})
export class LanguageComponent implements OnInit {

  public headers: any = ['Code', 'Language', 'Action'];

  public languageForm = this.formBuilder.group({
    languageName: ['', Validators.required],
    languageCode: ['', Validators.required]
  })

  get form_() { return this.languageForm.controls; };

  get _form() { return this.languageForm.value };

  public companyId: any = Number(sessionStorage.getItem('companyId'));

  public submitted: boolean = false;
  public requiredErrorText = 'can\'t be blank';
  public submitText = 'Create';
  public api = 'language'
  public submitProcessing = false;
  public popoverTitle = 'Delete Confirmation';
  public popoverMessage = 'Are you sure you want delete';
  public confirmClicked = false;
  public cancelClicked = false;

  public nationalites: any = [];
  public languageCode: any = '';
  public languageName: any = '';
  public languageList: any="";
  public languageId: any = '';
  public languageName1: any = '';
  public sortedData: any = [];

  public isLanguageBlank: any = '';
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
    this.fetchLanguages();
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
    this.fetchLanguages();
  }
  public searchModel='';
  fetchLanguages() {
    this.spinner.show();
    let url = this.api + '/list?search='+this.searchModel+'&page='+this.pageNumber+'&size=10';
    this.crudOperationsService.getList(url).subscribe((data: any) => {
      this.spinner.hide();
      this.languageList = data.data.content;
      this.handlePagination(data);
      this.languageList.sort((a: any, b: any) => a.languageId - b.languageId);
    },
      (error) => {
        this.spinner.hide();
        this.notification.notify('error', 'Something went wrong!');
      })
  }

  submit() {
    this.submitted = true;
    for (let el in this.form_) {
      if (this.form_[el].errors) {
        console.log(el)
      }
    }
    if (this.languageForm.valid) {
      let formData = this.getFormData();
      if (this.submitText !== 'Update') {
        this.save(formData, this.api);
        this.resetForm(); 
      } else {
        this.update(formData, this.api + `/${this.languageId}`);
        this.resetForm(); 
      }
    }
  }

  resetForm() {
    this.languageForm.reset();   
    this.submitted = false;      
    this.languageId = null;      
  }

  update(formData: any, api: string) {
    this.submitProcessing = true;
    this.crudOperationsService.update(formData, api)
      .subscribe((data: any) => {
        this.notification.notify('success', data.message);
        (<any>$('#language-add-modal')).modal('hide');
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
        (<any>$('#language-add-modal')).modal('hide');
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
    this.languageId = data.languageId;
    this.languageForm.reset();
    this.form_['languageCode'].patchValue(data.languageCode);
    this.form_['languageName'].patchValue(data.languageName);
    (<any>$('#language-add-modal')).modal('show');
  }

  delete(id: any) {
    this.crudOperationsService.delete(this.api + '/' + id).subscribe((data: any) => {
      console.log(data)
      this.fetchLanguages();
    })
  }

  clear() {
    this.languageForm.reset();
  }

}

