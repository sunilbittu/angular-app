import { Component, OnInit } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';
import { Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-parent-skill-master',
  templateUrl: './parent-skill-master.component.html',
  styleUrls: ['./parent-skill-master.component.css']
})
export class ParentSkillMasterComponent implements OnInit {

  public headers: any = ['Sl No', 'Skill', 'Action'];

  public skillForm = this.formBuilder.group({
    skillName: ['', Validators.required]
  })

  get form_() { return this.skillForm.controls; };

  get _form() { return this.skillForm.value };

  public companyId: number = Number(sessionStorage.getItem('companyId'));

  public submitted: boolean = false;
  public requiredErrorText = 'can\'t be blank';
  public submitText = 'Create';
  public api = 'parent-skill-master'
  public submitProcessing = false;
  public popoverTitle = 'Delete Confirmation';
  public popoverMessage = 'Are you sure you want delete';
  public confirmClicked = false;
  public cancelClicked = false;

  public skillList: any="";
  public id: any = '';
  public searchModel = '';

  //pagination
  itemsPerPage: any = 20;
  totalItems: any;
  currentPage: any;
  totalElements: number = 0;
  showingFrom: number = 0;
  showingTo: number = 0;
  public pageNumber: Number = 0;
  public showEmployeeDetails: boolean = false;

  constructor(private notification: NotifierService,
    private crudOperationsService: CrudOperationsService, private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.fetchSkills();
  }
  pageChanged(event: any) {
    this.pageNumber = event - 1;
    this.fetchSkills();
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

  fetchSkills() {
    this.spinner.show();
    let url = this.api + '/list/'+ this.companyId + '?search=' + this.searchModel + '&page=' + this.pageNumber + '&size=20';
    this.crudOperationsService.getList(url).subscribe((data: any) => {
      this.spinner.hide();
      this.skillList = data.data.content;
      //this.skillList.sort((a: any, b: any) => a.id - b.id);
      this.handlePagination(data);
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
    if (this.skillForm.valid) {
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
        if(data.httpStatus==='CONFLICT'){
          this.notification.notify('error', data.status);
        }else this.notification.notify('success', data.message);
        (<any>$('#skill-add-modal')).modal('hide');
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
        if(data.httpStatus==='CONFLICT'){
          this.notification.notify('error', data.status);
        }else this.notification.notify('success', data.message);

        (<any>$('#skill-add-modal')).modal('hide');
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
    this.skillForm.reset();
    this.form_['skillName'].patchValue(data.skillName);
    (<any>$('#skill-add-modal')).modal('show');
  }

  delete(id: any) {
    this.crudOperationsService.delete(this.api + '/' + id).subscribe((data: any) => {
      console.log(data)
      this.fetchSkills();
    })
  }

  clear() {
    this.submitted = false;
    this.skillForm.reset();
  }

}


